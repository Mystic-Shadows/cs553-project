import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

export const env = {
	port: Number(process.env.PORT || 3000),
	databaseUrl:
		process.env.DATABASE_URL ||
		"postgresql://postgres:postgres@localhost:5432/cs453",
};

import bcrypt from "bcryptjs";
import { pool } from "../db/pool";

// In a real deployment, set JWT_SECRET to a long random value kept outside git.
// The fallback keeps this classroom example runnable without cloud infrastructure.
export const jwtSecret = process.env.JWT_SECRET ?? "development-secret";
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? "1h";

export async function initAdmin() {
	try {
		var passwordHash = await bcrypt.hash("admin", 10);
		const query = `INSERT INTO users (username, password_hash, role) VALUES ($1, $2, 'admin') RETURNING username`;
		await pool.query(query, ["admin", passwordHash]);
		console.log(`admin acct created`);
	} catch (error) {
		console.log(`admin already exists`);
	}
}