"use client";

import { useEffect, useState } from "react";

export type LocalStorageState = [string | null | undefined, (value?: string) => void];

export function useLocalStorage(key: string, initialValue?: string): LocalStorageState {
	const [value, setValue] = useState<string | undefined | null>(initialValue);

	useEffect(() => {
		const val = localStorage.getItem(key) ?? initialValue;
		setValue(val);
	}, [key, initialValue]);

	function setItem(value?: string) {
		if (value == null) {
			localStorage.removeItem(key);
			setValue(null);
			return;
		}
		localStorage.setItem(key, value);
		setValue(value);
	}

	return [value, setItem];
}