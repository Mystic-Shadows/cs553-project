import { pool } from "../db/pool";

export async function postProjects(_req: any, _res: any) {
	const project = _req.body.project.trim(); // Pre-Validated

	try {
		const response = await makeProject(project);

		_res.status(201).json({
			project: response.rows[0]
		});

	} catch (error) {
		console.log(`${error}`)
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}

async function makeProject(project: any) {
	const query = `INSERT INTO projects (project) VALUES ($1) RETURNING id::int, project, created_at AS "createdAt", updated_at AS "updatedAt"`;
	return pool.query(query, [project]);
}