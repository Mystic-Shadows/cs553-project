import bcrypt from "bcryptjs";
import { pool } from "../db/pool";

export async function register(_req: any, _res: any) {
	const username = _req.body?.username?.trim();
	const password = _req.body?.password?.trim();

	if (!username || !password) {
		return _res.status(400).json({
			error: "Bad Request",
			message: "Username and password are required."
		});
	}

	try {
		const response = await registerUser(username, password);

		_res.status(201).json({
			user: response.rows[0]
		});

	} catch (error: any) {

		if (error.code === '23505') {
			return _res.status(400).json({
				error: "Bad Request", message: "Username already exists"
			});
		}
		console.log(`${error}`)
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}

async function registerUser(username: any, password: any) {
	var passwordHash = await bcrypt.hash(password, 10);
	const query = `INSERT INTO users (username, password_hash, role) VALUES ($1, $2, 'user') RETURNING username`;
	return pool.query(query, [username, passwordHash]);
}