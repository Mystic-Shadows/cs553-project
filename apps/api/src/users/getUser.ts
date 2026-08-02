import { pool } from "../db/pool";

export async function getUser(_req: any, _res: any) {
	const id = _req.params.id;

	if (_req.user.role !== "admin" && _req.user.sub !== id) {
		return _res.status(403).json({
			error: "Forbidden",
			message: `This action requires one of these roles: admin, self==id.`
		});
	}

	try {
		const response = await pool.query(
			`SELECT id,
					username,
					email,
					role,
					created_at AS "createdAt",
					updated_at AS "updatedAt"
			FROM users
			WHERE id=$1 `, [id]
		);

		if (response.rows.length == 0) {
			_res.status(404).json({ error: "User not found" });
		} else {
			_res.json(response.rows[0]);
		}
	} catch (error) {
		console.error("Failed to fetch users:", error);
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}