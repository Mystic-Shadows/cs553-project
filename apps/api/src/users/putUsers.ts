import { pool } from "../db/pool";

export async function putUsers(_req: any, _res: any) {
	const username = _req.body.username.trim(); // Pre-Validated
	const id = _req.params.id; // Pre-Validated

	try {
		const response = await makeUser(id, username);

		if (response.rows[0].updatedAt.getTime() === response.rows[0].createdAt.getTime()) {
			_res.status(201).json({
				user: response.rows[0]
			});
		} else {
			_res.status(200).json({
				user: response.rows[0]
			});
		}

	} catch (error) {
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}

async function makeUser(id: any, username: any) {

	// must set defaults if needed (for update section)
	const queryValues = [id, username];
	const query = `INSERT INTO users (id, username)
				   VALUES ($1, $2)
				   ON CONFLICT (id)
				   DO UPDATE SET username=EXCLUDED.username, updated_at=NOW()
				   RETURNING id::int, username, created_at AS "createdAt", updated_at AS "updatedAt"`;

	return pool.query(query, queryValues);
}