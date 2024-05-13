import Session from "@/models/session";
import { JwtService } from "@/services/jwt";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Database } from "@/services/database";
import { checkAuthorization } from "@/utilities";

dayjs.extend(utc)
dayjs.extend(timezone)

export async function GET(request: NextRequest) {
	const jwt = checkAuthorization(request);
	if (!jwt) {
		return new Response("not logged in", { status: 401 });
	}

	const email = await JwtService.instance.verify(jwt);
	if (!email) {
		return new Response("unauthorized, please login again", { status: 401 });
	}

	const session = await Database.instance.getCurrentSession(email);
	if (!session) {
		return new Response("no active session", { status: 404 });
	}

	// get session name
	const project = await Database.instance.projectDb.findOne({ _id: session.project });

	return NextResponse.json({ session, projectName: project?.name }, { status: 200 });
}

export async function POST(request: NextRequest) {
	const { project } = await request.json();
	if (!project) {
		return new Response("Missing project", { status: 400 });
	}

	const jwt = checkAuthorization(request);
	if (!jwt) {
		return new Response("not logged in", { status: 401 });
	}

	// verify jwt
	const email = await JwtService.instance.verify(jwt);
	if (!email) {
		return new Response("unauthorized, please login again", { status: 401 });
	}

	const startHour = parseInt(process.env.START_HOUR ?? "8");
	const startMinute = parseInt(process.env.START_MINUTE ?? "30");
	const endHour = parseInt(process.env.END_HOUR ?? "17");
	const endMinute = parseInt(process.env.END_MINUTE ?? "0");
	const tz = process.env.TZ || "America/Toronto";
	const day = dayjs().tz(tz).day();

	if (process.env.NODE_ENV !== "development") {
		// check it is not the weekend
		if (day === 0 || day === 6) {
			return new Response("it's weekend", { status : 403 });
		}

		// check if day has started
		if (dayjs().tz(tz).isBefore(dayjs().tz(tz).hour(startHour).minute(startMinute))) {
			return new Response("day has not started", { status: 403 });
		}

		// check if day has ended
		if (dayjs().tz(tz).isAfter(dayjs().tz(tz).hour(endHour).minute(endMinute))) {
			return new Response("day has ended", { status: 403 });
		}
	}
	
	// check if user has an active session
	if (await Database.instance.getCurrentSession(email)) {
		return new Response("you already has an active session", { status: 409 });
	}

	// create session
	const session: Session = {
		userEmail: email,
		project: ObjectId.createFromHexString(project),
		startedAt: dayjs().toDate(),
		endedAt: dayjs()
			.tz(tz)
			.hour(endHour)
			.minute(endMinute)
			.utc()
			.toDate()
	}

	await Database.instance.sessions.insertOne(session);

	return new Response("Session started", { status: 200 });
}

export async function DELETE(request: NextRequest) {

	const jwt = checkAuthorization(request);
	if (!jwt) {
		return new Response("not logged in", { status: 401 });
	}

	const email = await JwtService.instance.verify(jwt);
	if (!email) {
		return new Response("unauthorized, please login again", { status: 401 });
	}

	const session = await Database.instance.getCurrentSession(email);
	if (!session) {
		return new Response("no active session", { status: 404 });
	}

	// set the endedAt to now
	await Database.instance.sessions.updateOne(
		{ _id: session._id }, 
		{ $set: { endedAt: dayjs().toDate() } }
	);

	return NextResponse.json({ message: "Session ended" }, { status: 200 });
}