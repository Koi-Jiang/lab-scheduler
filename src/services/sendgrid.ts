import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmail(to: string, link: string) {
	await sgMail.send({
		to,
		from: process.env.SENDGRID_FROM_EMAIL!,
		templateId: "d-a3ddf1d9e90e41feb6f7435dcacd9e0e",
		dynamicTemplateData: { link },
	});
}