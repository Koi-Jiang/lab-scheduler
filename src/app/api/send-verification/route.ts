import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { Database } from "@/services/database";
import { sendEmail } from "@/services/sendgrid";

const SITE_URL = process.env.SITE_URL || "https://example.com";

export async function POST(request: NextRequest) {
	// get the email from the form data
	const data = await request.formData();
	let email = data.get('email') as string;

	// Addition check to see if the email is a valid uOttawa email
	// Theory: uOttawa email is either in the form of [a-zA-Z]{5}\d{1,3} or all letters
	// so if it includes a number, it must be 5 letters followed by 1-3 numbers

	// first check if the email contains a number
	if (/\d/.test(email)) {
		// check if the email is in the form of [a-zA-Z]{5}\d{1,3}
		if (!/^[a-zA-Z]{5}\d{1,3}$/.test(email)) {
			return NextResponse.redirect(new URL('/login?invalid', SITE_URL))
		}
	}
	else {
		// check if the email is all letters
		if (!/^[a-zA-Z]+$/.test(email)) {
			return NextResponse.redirect(new URL('/login?invalid', SITE_URL))
		}
	}

	email = email + "@uottawa.ca";
	
	// check if email has recently been sent a verification email, if so, return an error
	// get the collection
	// check if the email is in the database
	const existing = await Database.instance.verificationDb
		.findOne({ email: email });
	
	// if the email is in the database, return an error
	if (existing) {
		return NextResponse.redirect(new URL('/login?cooldown', SITE_URL))
	}

	// generate a random id for the verification link
	const loginId = nanoid(8);

	// Add the email, randId to database
	// this verification link will expire in 5 minutes
	await Database.instance.verificationDb.insertOne({ email, loginId: loginId, createdAt: new Date() });

	//  Send an email to the user with the verification link using SendGrid if it is production
	if (process.env.NODE_ENV === 'development')
		console.log(new URL(`/login/${loginId}`, SITE_URL).toString());
	else
		await sendEmail(email, new URL(`/login/${loginId}`, SITE_URL).toString());
	
	// if everything is good, redirect to check-email page
	return NextResponse.redirect(new URL('/check-email', SITE_URL))
}