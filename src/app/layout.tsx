import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import * as React from 'react'
import Navbar from "./components/Navbar";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Lab Scheduler",
	description: "Lab Scheduler",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// get theme and make sure it is one of "light" or "dark"
	let theme = cookies().get('theme')?.value;
	if (theme !== "light" && theme !== "dark") {
		theme = "light";
	}

	return (
		<html lang="en" className="group/root" data-theme={theme}>
			<body className={inter.className}>
					<div className="flex flex-col app">
						<Navbar />
						<main className="flex-1 overflow-y-auto">
							{children}
						</main>
					</div>
			</body>
		</html>
	);
}
