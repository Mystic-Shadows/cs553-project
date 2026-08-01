import { pool } from "../db/pool";

export async function getUsers(_req: any, _res: any) {
	try {
		const response = await pool.query(
			`SELECT id,
					username,
					email,
					role,
					created_at AS "createdAt",
					updated_at AS "updatedAt"
			FROM users
			ORDER BY id `,
		);

		_res.json({ users: response.rows });
	} catch (error) {
		console.error("Failed to fetch users:", error);
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}