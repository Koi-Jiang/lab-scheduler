"use client";

import { useLocalStorage } from "@/hooks";
import { pluralize } from "@/utilities";
import { FC, useEffect, useState } from "react";

const StartProject: FC<{ projectId: string }> = ({ projectId }) => {
	const [jwt] = useLocalStorage("token");
	const [stat, setStat] = useState<{ totalTime: number, sessionCount: number } | null | undefined>(undefined);

	async function loadData() {
		const res = await fetch(`/api/stats?project=${projectId}`, {
			headers: { "Authorization": `Bearer ${jwt}` }
		});
		if (res.ok) {
			setStat(await res.json());
		}
	}
	
	useEffect(() => {
		if (!jwt) return;
		loadData();
	}, [jwt]);

	async function startProject() {
		const res = await fetch("/api/session", {
			method: "POST",
			body: JSON.stringify({ project: projectId }),
			headers: { "Authorization": `Bearer ${jwt}` }
		});
		if (res.ok) {
			window.location.href = "/working";
			return;
		}

		// if status is 409, it means the user is already working on a project, redirect to working page
		if (res.status === 409) {
			alert("You are already working on a project, redirecting...");
			window.location.href = "/working";
			return;
		}

		alert(`Failed to start project due to ${await res.text() ?? "unknown error"}`);
	}

	return (
		<>
			{
				stat === undefined && (
					<span className="skeleton h-4 w-[200px]"></span>
				)
			}

			{
				stat === null && (
					<span className="opacity-50"> Never participated </span>
				)
			}

			{
				stat && (
					<span className="opacity-50">
						{(stat?.totalTime / 60).toFixed(1)} min{pluralize(stat?.totalTime ?? 0)} over {stat?.sessionCount} session{pluralize(stat?.sessionCount ?? 0)}
					</span>
				)
			}
			
			<button className="btn btn-primary" onClick={startProject}>
				Start
			</button>
		</>
	);
};

export default StartProject;