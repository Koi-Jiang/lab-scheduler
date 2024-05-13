"use client";

import { useLocalStorage } from "@/hooks";

export default function LogOutButton() {
	const [token] = useLocalStorage("token");
	
	function logOut() {
		localStorage.removeItem("token");
		window.location.href = "/";
	}

	return (
		token && (<button className="btn btn-ghost" onClick={logOut}>Log Out</button>)
	);
}