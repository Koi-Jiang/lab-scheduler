// service for signing and verifying jwt tokens

import * as jose from "jose";

export class JwtService {
	private static _instance: JwtService;
	private secret: Uint8Array;
	private site: string;

	private constructor() {
		this.secret = new TextEncoder().encode(
			process.env.JWT_SECRET || '0000000000000000000000000000000000000000000000000000000000000000'
		);

		this.site = process.env.SITE_URL || "https://example.com";
	}

	public static get instance() {
		if (!JwtService._instance) {
			JwtService._instance = new JwtService();
		}
		return JwtService._instance;
	}

	public async create(email: string) {
		const jwt = new jose.SignJWT({})
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setIssuer(this.site)
			.setAudience(this.site)
			.setSubject(email);

		return await jwt.sign(this.secret);
	}

	public async verify(token: string) {
		try {
			const jwt = await jose.jwtVerify(token, this.secret, {
				issuer: this.site,
				audience: this.site,
			})
			return jwt.payload.sub;
		}
		catch (e) {
			return null;
		}
	}
}
