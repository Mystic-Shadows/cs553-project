import { pool } from "../db/pool";
import { isOwner } from "../middleware/roleValidation";

export async function deleteAuthorizations(_req: any, _res: any) {
	const userId = _req.query.userId;
	const projectId = _req.query.projectId;

	if (_req.user.role !== "admin" && !(await isOwner(_req.user.sub, projectId))) {
		return _res.status(403).json({
			error: "Forbidden",
			message: `This action requires one of these roles: admin, owner (of project).`
		});
	}

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