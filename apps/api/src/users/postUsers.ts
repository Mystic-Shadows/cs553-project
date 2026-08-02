import bcrypt from "bcryptjs";
import { pool } from "../db/pool";

export async function postUsers(_req: any, _res: any) {
	const username = _req.body.username.trim(); // Pre-Validated
	const email = _req.body?.email;
	const password = _req.body.password.trim(); // Pre-Validated
	var role = _req.body?.role;

	if (!role) {
		role = "user"
	}

	try {
		const response = await makeUser(username, email, role, password);

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

export async function makeUser(username: any, email: any, role: any, password: any) {
	var passwordHash = await bcrypt.hash(password, 10);
	const query = `INSERT INTO users (username, email, role, password_hash) VALUES ($1, $2, $3, $4) RETURNING id::int, username, email, role, created_at AS "createdAt", updated_at AS "updatedAt"`;
	return pool.query(query, [username, email, role, passwordHash]);
}