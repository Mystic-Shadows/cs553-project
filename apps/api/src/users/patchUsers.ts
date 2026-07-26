import { pool } from "../db/pool";

export async function patchUsers(_req: any, _res: any) {
	const username = _req.body.username.trim(); // Pre-Validated
	const id = _req.params.id;

	try {
		const response = await patchUser(id, username);
		if (response.rows.length === 0) {
			_res.status(404).json({ error: "User not found" });
		} else {
			_res.status(200).json({
				user: response.rows[0]
			});
		}

	} catch (error) {
		console.log(`${error}`)
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}

async function patchUser(id: any, username: any) {
	const query = `UPDATE users SET username=$1, updated_at=NOW() WHERE id=$2 RETURNING id::int, username, created_at AS "createdAt", updated_at AS "updatedAt"`;
	return pool.query(query, [username, id]);
}