import { pool } from "../db/pool";

export async function putProjects(_req: any, _res: any) {
	const project = _req.body.project.trim(); // Pre-Validated
	const id = _req.params.id; // Pre-Validated

	try {
		const response = await makeProject(id, project);

		if (response.rows[0].updatedAt.getTime() === response.rows[0].createdAt.getTime()) {
			_res.status(201).json({
				project: response.rows[0]
			});
		} else {
			_res.status(200).json({
				project: response.rows[0]
			});
		}

	} catch (error) {
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}

async function makeProject(id: any, project: any) {

	// must set defaults if needed (for update section)
	const queryValues = [id, project];
	const query = `INSERT INTO projects (id, project)
				   VALUES ($1, $2)
				   ON CONFLICT (id)
				   DO UPDATE SET project=EXCLUDED.project, updated_at=NOW()
				   RETURNING id::int, project, created_at AS "createdAt", updated_at AS "updatedAt"`;

	return pool.query(query, queryValues);
}