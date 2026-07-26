import { pool } from "../db/pool";

export async function deleteUsers(_req: any, _res: any) {
	const id = _req.params.id;
	try {
		const response = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);

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