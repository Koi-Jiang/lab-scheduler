import { ObjectId } from "mongodb";

export default interface Session {
	userEmail: string;
	project: ObjectId;
	startedAt: Date;
	endedAt: Date;
}