import { pool } from "../db/pool";
import { isMember } from "../middleware/roleValidation";

export async function getProjects(_req: any, _res: any) {
	try {
		const response = await pool.query(
			`SELECT id,
					project,
					owner,
					description,
					created_at AS "createdAt",
					updated_at AS "updatedAt"
			FROM projects
			ORDER BY id `,
		);
		if (_req.user.role === "admin") {
			_res.json({ projects: response.rows });
		} else {
			const projects = [];
			for (var project of response.rows) {
				if (await isMember(_req.user.sub, project.id)) {
					projects.push(project);
				}
			}
			_res.json({ projects });
		}
		
	} catch (error) {
		console.error("Failed to fetch projects:", error);
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}