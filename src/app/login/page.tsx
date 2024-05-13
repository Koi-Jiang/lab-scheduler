
// when doing ssr, check if query paramter "invalid" is true, if so, display an error message

export default function Login({ searchParams }: { searchParams: Record<string, string> }) {
	const invalid = searchParams["invalid"] != null;
	const cooldown = searchParams["cooldown"] != null;
	const failed = searchParams["failed"] != null;
	const expired = searchParams["expired"] != null;

	return (
		<div className="hero min-h-full bg-base-200">

			{(invalid || cooldown || failed || expired) && (
				<div className="toast toast-start">

					{ invalid && (
						<div className="alert alert-error">
							<span>Invalid uOttawa Email, please try again.</span>
						</div>
					)}

					{ cooldown && (
						<div className="alert alert-error">
							<span>Too many requests, please try again later.</span>
						</div>
					)}

					{ failed && (
						<div className="alert alert-error">
							<span>Failed to send email, please try again later.</span>
						</div>
					)}

					{ expired && (
						<div className="alert alert-error">
							<span>Verification link has expired, please try again.</span>
						</div>
					)}
				</div>
			)}
			
			<div className="hero-content flex-col gap-x-12 lg:flex-row-reverse max-w-screen-lg">
				<div className="text-center lg:text-left">
					<h1 className="text-5xl font-bold">Join now!</h1>
					<p className="py-6">Enter your uOttawa email, and we will send your a ✨Magic Link✨ to login.</p>
				</div>
				<div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
					<form className="card-body" action="/api/send-verification" method="post" autoComplete="off">
						<div className="form-control">
							<label className="input input-bordered flex items-center justify-between gap-2">
								<input autoComplete="false" type="text" name="email" className="grow max-w-32" placeholder="jdoe042" required
									pattern="[a-zA-Z0-9]+" title="Your uOttawa Email" id="emailInput" />
								@uottawa.ca
							</label>
							<script src="/removeEmailDomain.js" defer></script>
						</div>
						<div className="form-control mt-6">
							<button className="btn btn-primary" type="submit">✨ Send Magic Link ✨</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}