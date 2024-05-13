import "@/app/globals.css";
import ThemeToggle from "./ThemeToggle";
import LogOutButton from "./LogOutButton";
import { cookies } from "next/headers";

export default function Navbar() {
	const color = cookies().get("theme")?.value as "light" | "dark" | undefined;
	return (
		<header className="navbar bg-base-100 shadow">
			<div className="flex-1">
				<a className="btn btn-ghost text-2xl" href="/">Lab Scheduler</a>
			</div>
			<LogOutButton />
			<div className="flex-none m-2">
				
				<ThemeToggle default={color} />
			</div>
		</header>
	);
}