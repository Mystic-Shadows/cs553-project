import { pool } from "../db/pool";
import { isMember } from "../middleware/roleValidation";

export async function getTasks(_req: any, _res: any) {
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
			ORDER BY id `,
		);
		if (_req.user.role === "admin") {
			_res.json({ tasks: response.rows });
		} else {
			const tasks = [];
			for (var task of response.rows) {
				if (task.project == 0 || await isMember(_req.user.sub, task.project)) {
					tasks.push(task);
				}
			}
			_res.json({ tasks });
		}

	} catch (error) {
		console.error("Failed to fetch tasks:", error);
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}