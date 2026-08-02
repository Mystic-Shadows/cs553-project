import { pool } from "../db/pool";
import { isMember } from "../middleware/roleValidation";

export async function getTask(_req: any, _res: any) {
	const id = _req.params.id;
	try {
		const response = await pool.query(
			`SELECT id,
					title,
					description,
					status,
					assignee,
					project,
					created_at AS "createdAt",
					updated_at AS "updatedAt"
			FROM tasks
			WHERE id=$1 `, [id]
		);

		if (response.rows.length == 0) {
			_res.status(404).json({ error: "Task not found" });
		} else if (_req.user.role !== "admin" && response.rows[0].project && !(await isMember(_req.user.sub, response.rows[0].project))) {
			return _res.status(403).json({
				error: "Forbidden",
				message: `This action requires one of these roles: admin, member (of project)`
			});
		} else {
			_res.json(response.rows[0]);
		}
	} catch (error) {
		console.error("Failed to fetch tasks:", error);
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}