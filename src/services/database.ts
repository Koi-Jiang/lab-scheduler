// a singleton class to manage the database connection

import { MongoClient, Collection } from "mongodb";
import { Verification } from "@/models/verification";
import { Project } from "@/models/project";
import Session from "@/models/session";
import first from "lodash/first";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export class Database {
	private static _instance: Database;
	private client: MongoClient;

	public verificationDb: Collection<Verification>;
	public projectDb: Collection<Project>;
	public sessions: Collection<Session>;

	private constructor() {
		const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
		this.client = new MongoClient(uri);

		// connect to the database
		this.connect();

		const db = this.client.db("data");

		// verification collection for email magic links
		this.verificationDb = db.collection<Verification>("verifications");
		this.verificationDb.createIndex({ createdAt: 1 }, { expireAfterSeconds: 300 });
		this.verificationDb.createIndex({ loginId: 1 }, { unique: true });

		// project collection for storing project definitions
		this.projectDb = db.collection<Project>("projects");

		// user collection
		this.sessions = db.collection<Session>("sessions");
		this.sessions.createIndex({ userEmail: 1 });
		this.sessions.createIndex({ startedAt: -1 });
	}

	public static get instance() {
		if (!Database._instance) {
			Database._instance = new Database();
		}
		return Database._instance;
	}

	public async connect() {
		await this.client.connect();
	}

	public async disconnect() {
		await this.client.close();
	}

	public async getCurrentSession(email: string) {
		const session = first(await this.sessions
			.find({ userEmail: email })
			.sort({ startedAt: -1 })
			.limit(1)
			.toArray());
		if (!session) {
			return null;
		}
		if (dayjs().isAfter(dayjs(session.endedAt))) {
			return null;
		}
		return session;
	}
}