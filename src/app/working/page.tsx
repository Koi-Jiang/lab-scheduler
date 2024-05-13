"use client";

import Session from "@/models/session";
import { useEffect, useState } from "react";
import HMSTimer from "../components/HMSTimer";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc)
dayjs.extend(timezone)

type SessionResponseData = { session: Session, projectName: string };

export default function Working() {
	
	// get the project working on and display a timer for how long the user has been working
	// also display a button to stop working

	const [session, setSession] = useState<SessionResponseData>();

	// get the session from the database
	useEffect(() => {
		fetch("/api/session", {
			method: "GET",
			headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
		}).then(async (response) => {
			if (!response.ok) {
				alert("Failed to get session");
				window.location.href = "/";
				return;
			}

			setSession(await response.json() as SessionResponseData);
		});
	}, []);

	function endTask() {
		fetch("/api/session", {
			method: "DELETE",
			headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
		}).then(async (response) => {
			if (!response.ok) {
				alert("Failed to end task");
				return;
			}

			window.location.href = "/projects";
			alert(`Task ended, thank you for your contribution! You have clocked in ${dayjs().diff(session?.session.startedAt, "minute")} minutes`);
		});
	}

	return (
		<div className="grid place-items-center min-h-full">
			<div className="flex flex-col items-center gap-5">
				<h1 className="text-4xl text-center m-5">
				{
					!session && (
						<div className="skeleton h-11 w-[min(500px,80vw)]"></div>
					)
				}
				{
					session && (
						<span>Working on  {session?.projectName}</span>
					)
				}</h1>
				<HMSTimer startDate={dayjs(session?.session.startedAt).local()}/>
				<button className="btn btn-lg btn-outline btn-error m-5" onClick={endTask}>End Task</button>
			</div>	
		</div>
	)
}