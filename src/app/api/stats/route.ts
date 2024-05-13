import { Database } from "@/services/database";
import { JwtService } from "@/services/jwt";
import { checkAuthorization } from "@/utilities";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const jwt = checkAuthorization(request);
	if (!jwt) {
		return new Response("not logged in", { status: 401 });
	}

	const email = await JwtService.instance.verify(jwt);
	if (!email) {
		return new Response("unauthorized, please login again", { status: 401 });
	}

	const query = new URL(request.url).searchParams;
	const project = query.get("project");

	if (!project) {
		return new Response("Missing project", { status: 400 });
	}

	const cur = Database.instance.sessions.aggregate<{ totalTime: number, sessionCount: number }>(
		[
			{
				$match: {
					userEmail: email,
					project: ObjectId.createFromHexString(project)
				}
			},
			{
				$addFields: {
					time: {
						$dateDiff: {
							startDate: "$startedAt",
							endDate: "$endedAt",
							unit: "second"
						}
					}
				}
			},
			{
				$group: {
					_id: "$project",
					sessionCount: {
						$sum: 1
					},
					totalTime: {
						$sum: "$time"
					}
				}
			}
		]);
	const result = await cur.next();
	await cur.close();

	return NextResponse.json(result, { status: 200 });
}