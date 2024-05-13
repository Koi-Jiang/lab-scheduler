import { Database } from "@/services/database";

export default async function ByUserStats() {
	const userStats = await Database.instance.projectDb.aggregate<{
		_id: string | null,
		sessions: {
			project: string,
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
					_id: "$_id.userEmail",
					sessions: {
						$push: {
							project: "$_id.projectName",
							totalTime: "$totalTime",
							sessionCount: "$sessionCount"
						}
					}
				}
			},
			{
				$project: {
					_id: 1,
					sessions: {
						$sortArray: {
							input: "$sessions",
							sortBy: {
								project: 1
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
		<div className="max-w-screen-xl mx-auto p-5" >
			<h1 className="text-4xl mb-5">
				Stats by User
			</h1>

			<ol>
				{
					userStats.map((user) => user._id && (
						<li className="my-5 card nice-card shadow p-5" key={user._id}>
							<h2 className="text-2xl">{user._id}</h2>
							<div className="divider divider-start m-0"></div>
							<div className="overflow-x-scroll">
								<table className="table">
									<thead>
										<tr>
											<th className="w-[69%]">Project</th>
											<th>Sessions</th>
											<th>Time (mins)</th>
										</tr>
									</thead>
									<tbody>
										{
											user.sessions.map((session) => (
												<tr key={session.project} className="hover">
													<td>{session.project}</td>
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


		</div >
	);
}