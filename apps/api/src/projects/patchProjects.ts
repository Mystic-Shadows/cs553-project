import { pool } from "../db/pool";

export async function patchProjects(_req: any, _res: any) {
	const project = _req.body.project.trim(); // Pre-Validated
	const id = _req.params.id;

	try {
		const response = await patchProject(id, project);
		if (response.rows.length === 0) {
			_res.status(404).json({ error: "Project not found" });
		} else {
			_res.status(200).json({
				project: response.rows[0]
			});
		}

	} catch (error) {
		console.log(`${error}`)
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}

async function patchProject(id: any, project: any) {
	const query = `UPDATE projects SET project=$1, updated_at=NOW() WHERE id=$2 RETURNING id::int, project, created_at AS "createdAt", updated_at AS "updatedAt"`;
	return pool.query(query, [project, id]);
}