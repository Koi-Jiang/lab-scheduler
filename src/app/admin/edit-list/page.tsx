"use client";

import { Project } from "@/models/project";
import { WithId } from "mongodb";
import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";

export default function EditList() {

	const [projects, setProjects] = useState<WithId<Project>[] | null>(null);

	const reload = async () => {
		const response = await fetch("/api/admin/projects");
		const data = await response.json();
		setProjects(data);
	};

	useEffect(() => {
		reload();
	}, []);

	const handleSave = async (id: string, name: string, description: string) => {
		console.log("Saving project", id, name, description);
		
		const project = { _id: id, name, description };

		await fetch("/api/admin/projects", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(project)
		});
	}

	const handleDelete = async (id: string) => {
		console.log("Deleting project", id);

		const project = { _id: id };

		await fetch("/api/admin/projects", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(project)
		});

		// reload page
		setProjects(null);
		reload();
	}

	const handleAdd = async () => {
		console.log("Adding new project");

		await fetch("/api/admin/projects", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ name: "New Project", description: "TODO" })
		});

		// reload page
		setProjects(null);
		reload();
	}

	if (!projects) {
		return (
			<div className="grid place-items-center h-full">
				<span className="loading loading-bars loading-lg"></span>
			</div>
		);
	}

	return (
		<div className="max-w-screen-lg mx-auto my-5">
			<h1 className="text-4xl mb-5">
				Projects
			</h1>
			<ol>
				{
					projects!.map((project) => (
						<ProjectCard
							key={project._id.toString()}
							id={project._id.toString()}
							name={project.name}
							description={project.description}
							onSave={handleSave}
							onDelete={handleDelete}
							/>
					))
				}

				<li className="my-5 mb-[10vh]">
					<button className="btn w-full shadow-lg card nice-card" onClick={handleAdd}> + Add Project</button>
				</li>
			</ol>
		</div>
	)
}
