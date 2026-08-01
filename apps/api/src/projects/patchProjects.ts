import { pool } from "../db/pool";

export async function patchProjects(_req: any, _res: any) {
	const project = _req.body?.project?.trim(); // Pre-Validated
	const owner = Number(_req.body?.owner?.trim()); // Pre-Validated
	const description = _req.body?.description?.trim(); // Pre-Validated
	const id = _req.params.id;

	try {
		const response = await patchProject(id, project, owner, description);
		if (response === null) {
			_res.status(400).json({ error: "No valid changes in request" });
		} else if (response.rows.length === 0) {
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

async function patchProject(id: any, project: any, owner: any, description: any) {

	const queryValues = [];

	var query = `UPDATE projects SET`

	var needsComma = false;
	var nextParamCount = 1;

	if (project) {
		query += ` project=$${nextParamCount}`;
		queryValues.push(project);
		nextParamCount++;
		needsComma = true;
	}

	if (description || description === "") { // can be 'empty'
		if (needsComma) {
			query += `, `;
		}
		query += ` description=$${nextParamCount}`;
		queryValues.push(description);
		nextParamCount++;
		needsComma = true;
	}

	if (owner || owner === 0) {
		if (needsComma) {
			query += `, `;
		}
		query += ` owner=$${nextParamCount}`;
		queryValues.push(owner);
		nextParamCount++;
		needsComma = true;
	}

	query += `, updated_at=NOW() WHERE id=$${nextParamCount} RETURNING id::int, project, owner, description, created_at AS "createdAt", updated_at AS "updatedAt"`;
	queryValues.push(id);

	if (needsComma) {
		return pool.query(query, queryValues);
	}

	return null;
}