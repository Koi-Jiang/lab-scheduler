import { Database } from "@/services/database";
import StartProject from "./StartProject";

export default async function ProjectsPage() {

	const projects = await Database.instance.projectDb.find({}).toArray();

	return (
		<ol className="flex flex-wrap gap-5 p-5 justify-center">
			{
				projects.map((project) => (
					<li className="card w-96 nice-card shadow-lg" key={project._id.toString()}>
						<div className="card-body">
							<h2 className="card-title">{project.name}</h2>
							<p>{project.description}</p>
							<div className="card-actions justify-between items-center mt-2">
								<StartProject projectId={project._id.toString()} />
							</div>
						</div>
					</li>
				))
			}
		</ol>
	)
}