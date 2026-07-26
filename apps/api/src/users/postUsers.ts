import { pool } from "../db/pool";

export async function postUsers(_req: any, _res: any) {
	const username = _req.body.username.trim(); // Pre-Validated

	try {
		const response = await makeUser(username);

		_res.status(201).json({
			user: response.rows[0]
		});

	} catch (error) {
		console.log(`${error}`)
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}

async function makeUser(username: any) {
	const query = `INSERT INTO users (username) VALUES ($1) RETURNING id::int, username, created_at AS "createdAt", updated_at AS "updatedAt"`;
	return pool.query(query, [username]);
}