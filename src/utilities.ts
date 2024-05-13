import { NextRequest } from "next/server";

export function pluralize(n: number, singular?: string, plural?: string) {
	return n !== 1 ? plural ?? "s" : singular ?? "";
}

export function checkAuthorization(request: NextRequest): string | null {
	const authHeader = request.headers.get("authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return null;
	}
	return authHeader.slice(7);
}
