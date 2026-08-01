import { pool } from "../db/pool";

export async function deleteAuthorizations(_req: any, _res: any) {
	const userId = _req.query.userId;
	const projectId = _req.query.projectId;
	try {
		const response = await pool.query(`DELETE FROM authorizations WHERE user_id=$1 AND project_id=$2`, [userId, projectId]);

		if (response.rowCount == 0) {
			_res.status(404).json({ error: "Authorization not found" });
		} else {
			_res.status(204).end();
		}

	} catch (error) {
		console.error("Failed to delete authorization:", error);
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}