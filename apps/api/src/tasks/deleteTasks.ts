import { pool } from "../db/pool";
import { isMember } from "../middleware/roleValidation";

export async function deleteTasks(_req: any, _res: any) {
	const id = _req.params.id;

	try {
		const info = await pool.query(
			`SELECT project
			FROM tasks
			WHERE id=$1 `, [id]
		);

		if (info.rows.length == 0) {
			_res.status(404).json({ error: "Task not found" });
		}
		const project = info.rows[0].project;
		if (_req.user.role !== "admin" && project && !(await isMember(_req.user.sub, project))) {
			return _res.status(403).json({
				error: "Forbidden",
				message: `This action requires one of these roles: admin, member (of project), or no project ID.`
			});
		}

		const response = await pool.query(`DELETE FROM tasks WHERE id=$1`, [id]);

		if (response.rowCount == 0) {
			_res.status(404).json({ error: "Task not found" });
		} else {
			_res.status(204).end();
		}

	} catch (error) {
		console.error("Failed to delete task:", error);
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}