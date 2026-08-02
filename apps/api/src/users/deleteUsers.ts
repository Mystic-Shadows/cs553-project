import { pool } from "../db/pool";

export async function deleteUsers(_req: any, _res: any) {
	const id = _req.params.id;

	if (_req.user.role !== "admin" && _req.user.sub !== id) {
		return _res.status(403).json({
			error: "Forbidden",
			message: `This action requires one of these roles: admin, self==id.`
		});
	}

	try {
		const response = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
		await pool.query(`DELETE FROM authorizations WHERE user_id=$1`, [id]);
		await pool.query(`UPDATE tasks SET assignee=0 WHERE assignee=$1`, [id]);
		await pool.query(`UPDATE projects SET owner=0 WHERE owner=$1`, [id]);

		if (response.rowCount == 0) {
			_res.status(404).json({ error: "User not found" });
		} else {
			_res.status(204).end();
		}

	} catch (error) {
		console.error("Failed to delete user:", error);
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}