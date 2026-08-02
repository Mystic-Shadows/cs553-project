import { pool } from "../db/pool";
import { isMember } from "../middleware/roleValidation";


export async function getProject(_req: any, _res: any) {
	const id = _req.params.id;

	if (_req.user.role !== "admin" && !(await isMember(_req.user.sub, id))) {
		return _res.status(403).json({
			error: "Forbidden",
			message: `This action requires one of these roles: admin, member (of project).`
		});
	}

	try {
		const response = await pool.query(
			`SELECT id,
					project,
					owner,
					description,
					created_at AS "createdAt",
					updated_at AS "updatedAt"
			FROM projects
			WHERE id=$1 `, [id]
		);

		if (response.rows.length == 0) {
			_res.status(404).json({ error: "Project not found" });
		} else {
			_res.json(response.rows[0]);
		}
	} catch (error) {
		console.error("Failed to fetch projects:", error);
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}