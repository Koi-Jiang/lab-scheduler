"use client";

import { useEffect } from "react";
import { FC } from "react";

const CheckJwt: FC<{ target: string }> = ({ target }) => {
	useEffect(() => {
		// if we have a jwt token, redirect to the target page
		const jwt = localStorage.getItem("token");
		if (jwt != null) {
			window.location.href = target;
		}	
	}, [target]);

	return (
		<></>
	);
}

export default CheckJwt;