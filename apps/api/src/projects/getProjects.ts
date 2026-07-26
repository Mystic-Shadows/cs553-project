import { pool } from "../db/pool";

export async function getProjects(_req: any, _res: any) {
	try {
		const response = await pool.query(
			`SELECT id,
					project,
					created_at AS "createdAt",
					updated_at AS "updatedAt"
			FROM projects
			ORDER BY id `,
		);

		_res.json({ projects: response.rows });
	} catch (error) {
		console.error("Failed to fetch projects:", error);
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}