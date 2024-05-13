import { Project } from "@/models/project";
import { Database } from "@/services/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	return NextResponse.json(await Database.instance.projectDb.find({}).toArray(), { status: 200 });
}

export async function POST(request: NextRequest) {
	const body = (await request.json()) as Project;
	const project = { name: body.name, description: body.description };
	const result = await Database.instance.projectDb.insertOne(project);
	return NextResponse.json(result, { status: 201 });
}

export async function PUT(request: NextRequest) {
	const body = (await request.json()) as { _id: string } & Project;
	const project = { name: body.name, description: body.description };
	const result = await Database.instance.projectDb.updateOne({ _id: ObjectId.createFromHexString(body._id) }, { $set: project });
	return NextResponse.json(result, { status: 200 });
}

export async function DELETE(request: NextRequest) {
	const body = (await request.json()) as { _id: string } & Project;
	const result = await Database.instance.projectDb.deleteOne({ _id: ObjectId.createFromHexString(body._id) });
	return NextResponse.json(result, { status: 200 });
}