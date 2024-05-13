import React, { FC } from "react";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const HMSTimer: FC<{ startDate: Dayjs; }> = ({ startDate }) => {
	const [hours, setHours] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [seconds, setSeconds] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			const timeSpan = dayjs.duration(dayjs().diff(startDate));
			setHours(Math.floor(timeSpan.asHours()));
			setMinutes(timeSpan.minutes());
			setSeconds(timeSpan.seconds());
		}, 1000);
		return () => clearInterval(interval);
	}, [startDate]);

	return (
		<div className="grid grid-flow-col gap-4 text-center auto-cols-max">
			<div className="flex flex-col p-4 rounded-box nice-card shadow">
				<span className="countdown font-mono text-6xl">
					{ /* @ts-ignore */ }
					<span style={{ "--value": hours }}></span>
				</span>
				hours
			</div> 
			<div className="flex flex-col p-4 rounded-box nice-card shadow">
				<span className="countdown font-mono text-6xl">
					{ /* @ts-ignore */ }
					<span style={{ "--value": minutes }}></span>
				</span>
				min
			</div> 
			<div className="flex flex-col p-4 rounded-box nice-card shadow">
				<span className="countdown font-mono text-6xl">
					{ /* @ts-ignore */ }
					<span style={{ "--value": seconds }}></span>
				</span>
				sec
			</div>
		</div>
	);
}

export default HMSTimer;
