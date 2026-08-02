import { pool } from "../db/pool";
import { isOwner } from "../middleware/roleValidation";

export async function deleteProjects(_req: any, _res: any) {
	const id = Number(_req.params.id);

	if (_req.user.role !== "admin" && !(await isOwner(_req.user.sub, id))) {
		return _res.status(403).json({
			error: "Forbidden",
			message: `This action requires one of these roles: admin, owner (of project).`
		});
	}

	try {
		const response = await pool.query(`DELETE FROM projects WHERE id=$1`, [id]);
		await pool.query(`DELETE FROM authorizations WHERE project_id=$1`, [id]);
		await pool.query(`UPDATE tasks SET project=0 WHERE project=$1`, [id]);

		if (response.rowCount == 0) {
			_res.status(404).json({ error: "Project not found" });
		} else {
			_res.status(204).end();
		}

	} catch (error) {
		console.error("Failed to delete project:", error);
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}