import CheckJwt from "./components/CheckJwt";

export default function Home() {
	return (
		<>
			<CheckJwt target="/projects" />
			<div className="hero min-h-full">
				<div className="hero-content text-center pb-[20vh]">
					<div className="max-w-md">
						<div className="text-7xl my-10">👋</div>
						<h1 className="text-5xl font-bold">Hello there</h1>
						<p className="py-6">
							Join our lab and contribute to scientific research. Choose from a variety of projects and start contributing today!
						</p>
						<a href="/login" className="btn btn-primary">Get Started</a>
					</div>
				</div>
			</div>
		</>
	);
}
