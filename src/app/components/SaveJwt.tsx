"use client";

import { useEffect } from "react";
import { FC } from "react";

const SaveJwt: FC<{ token: string, target: string }> = ({ token, target }) => {
	useEffect(() => {
		localStorage.setItem("token", token);
		window.location.href = target;
	}, [target, token]);

	return (
		<></>
	);
}

export default SaveJwt;