import { Database } from "@/services/database";
import { pluralize } from "@/utilities";


export default async function Stats() {
	const projectStats = await Database.instance.projectDb.aggregate(
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
				$addFields: {
					sessionCount: {
						$size: "$sessions"
					},
					uniqueUsers: {
						$size: {
							$setDifference: [
								"$sessions.userEmail",
								[]
							]
						}
					},
					times: {
						$map: {
							input: "$sessions",
							as: "item",
							in: {
								time: {
									$dateDiff: {
										startDate: "$$item.startedAt",
										endDate: "$$item.endedAt",
										unit: "second"
									}
								}
							}
						}
					}
				}
			},
			{
				$project: {
					_id: 0,
					name: 1,
					sessionCount: 1,
					uniqueUsers: 1,
					totalTime: {
						$sum: "$times.time"
					}
				}
			}
		]).toArray() as {
			name: string;
			sessionCount: number;
			uniqueUsers: number;
			totalTime: number;
		}[];


	return (
		<div className="max-w-screen-xl mx-auto p-5">
			<h1 className="text-4xl mb-5 flex justify-between items-center">
				Admin Dashboard
				<a className="btn btn-sm btn-outline" href="/admin/edit-list">
					Edit Project List
				</a>
			</h1>

			<ol className="stats shadow w-full stats-vertical sm:stats-horizontal card nice-card">
				{projectStats.map((stat) => {
					return (
						<li className="stat" key={stat.name}>
							<div className="stat-title">{stat.name}</div>
							<div className="stat-value font-normal text-xl my-2">
								<span className="text-primary font-bold text-5xl">{(stat.totalTime / 60).toFixed(1)} </span>
								min{pluralize(stat.totalTime)}</div>
							<div className="stat-desc">{stat.sessionCount} session{pluralize(stat.sessionCount)} by {stat.uniqueUsers} unique user{pluralize(stat.uniqueUsers)} </div>
						</li>
					);
				})}
			</ol>

			<div className="flex flex-col sm:flex-row justify-center my-10">
				<a className="btn btn-lg btn-primary h-24" href="/admin/stats/by-project">Stats by Project</a>
				<div className="divider sm:divider-horizontal"></div>
				<a className="btn btn-lg btn-primary h-24" href="/admin/stats/by-user">Stats by User</a>
			</div>
		</div>
	);
}
