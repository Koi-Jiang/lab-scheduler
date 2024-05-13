import { useState } from "react";

interface ProjectArgs {
	id: string;
	name: string;
	description: string;
	onSave: (id: string, name: string, description: string) => void;
	onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectArgs> = (project) => {

	const [name, setName] = useState(project.name);
	const [description, setDescription] = useState(project.description);

	const handleRevert = () => {
		setName(project.name);
		setDescription(project.description);
	};

	const handleSave = () => {
		project.onSave(project.id, name, description);
	};

	const handleConfirmDelete = () => {
		const modal = document.getElementById(`delete_modal_${project.id}`) as HTMLDialogElement;
		modal.showModal();
	}

	const handleDelete = () => {
		project.onDelete(project.id);
	};

	return (
		<li className="card shadow my-5 p-5 gap-2 nice-card">
			<input type="text" className="input w-full input-bordered" 
				value={name}
				onChange={(v) => setName(v.target.value)}/>
			<textarea className="textarea textarea-bordered"
				value={description}
				onChange={(v) => setDescription(v.target.value)}/>
			<div className="flex flex-row-reverse items-center gap-2 mt-2">
				<button className="btn btn-success btn-outline" onClick={handleSave}>Save</button>
				<button className="btn btn-neutral btn-outline" onClick={handleRevert}>Revert</button>
				<button className="btn btn-error btn-outline" onClick={handleConfirmDelete}>Delete</button>

				<span className="flex-grow opacity-50">{project.id}</span>
			</div>

			<dialog id={`delete_modal_${project.id}`} className="modal modal-bottom sm:modal-middle">
				<div className="modal-box">
					<h3 className="font-bold text-lg">🚨🚨🚨 Are you sure about that? 🚨🚨🚨 </h3>
					<p className="py-4">⚠️ This will delete the project permanently. This action cannot be undone, are you sure you want to continue? ⚠️</p>
					<div className="modal-action">
						<form method="dialog">
							<button className="btn btn-error mr-2 btn-outline" onClick={handleDelete}>Delete</button>
							<button className="btn btn-outline">Cancel</button>
						</form>
					</div>
				</div>
			</dialog>
		</li>
	);
}

export default ProjectCard;