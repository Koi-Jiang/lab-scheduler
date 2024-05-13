import SaveJwt from "@/app/components/SaveJwt";
import { Database } from "@/services/database";
import { JwtService } from "@/services/jwt";
import { redirect } from "next/navigation";

const SITE_URL = process.env.SITE_URL || "https://example.com";

export default async function LoginVerification(params: {params: {loginId: string}}) {
	const verification = await Database.instance.verificationDb.findOne({ loginId: params.params.loginId });

	if (!verification) {
		redirect(new URL("/login?expired", SITE_URL).toString());
	}

	// delete verification from database
	// or we just don't delete it and let it expire after 5 minutes, because
	// link preview bots might visit the link before the user does and the link
	// would be invalid by the time the user clicks on it
	// await Database.instance.verificationDb.deleteOne({ loginId: params.params.loginId });

	// generate jwt token
	const jwt = await JwtService.instance.create(verification.email);
	console.log(jwt);

	return (
		<>
			<SaveJwt token={jwt} target="/projects" />
			<p> Redirecting... </p>
		</>
	);
}