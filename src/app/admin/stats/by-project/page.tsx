import { Database } from "@/services/database";

export default async function ByProjectStats() {
	const projectStats = await Database.instance.projectDb.aggregate<{
		_id: string,
		projectName: string,
		sessions: {
			email: string | null,
			totalTime: number,
			sessionCount: number
		}[]
	}>(
		[
			{
				$lookup: {
					from: "sessions",
					localField: "_id",
					foreignField: "project",
					as: "sessions"
				}
			},
			{
				$unwind: {
					path: "$sessions",
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$addFields: {
					time: {
						$dateDiff: {
							startDate: "$sessions.startedAt",
							endDate: "$sessions.endedAt",
							unit: "second"
						}
					}
				}
			},
			{
				$group: {
					_id: {
						projectId: "$_id",
						projectName: "$name",
						userEmail: "$sessions.userEmail"
					},
					totalTime: {
						$sum: "$time"
					},
					sessionCount: {
						$sum: 1
					}
				}
			},
			{
				$group: {
					_id: "$_id.projectId",
					projectName: {
						$first: "$_id.projectName"
					},
					sessions: {
						$push: {
							email: "$_id.userEmail",
							totalTime: "$totalTime",
							sessionCount: "$sessionCount"
						}
					}
				}
			},
			{
				$project: {
					_id: 1,
					projectName: 1,
					sessions: {
						$sortArray: {
							input: "$sessions",
							sortBy: {
								userEmail: 1
							}
						}
					}
				}
			},
			{
				$sort: {
					_id: 1
				}
			}
		]).toArray();

	return (
		<div className="max-w-screen-xl mx-auto p-5">
			<h1 className="text-4xl mb-5">
				Stats by Project
			</h1>

			<ol>
				{
					projectStats.map((project) => (
						<li className="my-5 card nice-card shadow p-5" key={project._id}>
							<h2 className="text-2xl">{project.projectName}</h2>
							<div className="divider divider-start m-0"></div>
							<div className="overflow-x-scroll">
								<table className="table">
									<thead>
										<tr>
											<th className="w-[69%]">User</th>
											<th>Sessions</th>
											<th>Time (mins)</th>
										</tr>
									</thead>
									<tbody>
										{
											project.sessions.map((session) => session.email && (
												<tr key={session.email} className="hover">
													<td>{session.email}</td>
													<td>{session.sessionCount}</td>
													<td>{(session.totalTime / 60).toFixed(1)}</td>
												</tr>
											))
										}
									</tbody>
								</table>
							</div>
						</li>
					))
				}
			</ol>

		</div>
	);
}