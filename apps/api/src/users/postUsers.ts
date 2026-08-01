import { pool } from "../db/pool";

export async function postUsers(_req: any, _res: any) {
	const username = _req.body.username.trim(); // Pre-Validated
	const email = _req.body?.email;
	var role = _req.body?.role;

	if (!role) {
		role = "user"
	}

	try {
		const response = await makeUser(username, email, role);

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

async function makeUser(username: any, email: any, role: any) {
	const query = `INSERT INTO users (username, email, role) VALUES ($1, $2, $3) RETURNING id::int, username, email, role, created_at AS "createdAt", updated_at AS "updatedAt"`;
	return pool.query(query, [username, email, role]);
}