import { pool } from "../db/pool";

export async function postProjects(_req: any, _res: any) {
	const project = _req.body.project.trim(); // Pre-Validated
	const description = _req.body.description.trim(); // Pre-Validated

	// TODO PULL FROM REQUESTOR
	const owner = 0;

	try {
		const response = await makeProject(project, owner, description);

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

async function makeProject(project: any, owner: any, description: any) {
	const query = `INSERT INTO projects (project, owner, description) VALUES ($1, $2, $3) RETURNING id::int, project, owner, description, created_at AS "createdAt", updated_at AS "updatedAt"`;
	return pool.query(query, [project, owner, description]);
}