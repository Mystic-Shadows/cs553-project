import { pool } from "../db/pool";

export async function patchTasks(_req: any, _res: any) {
	const id = _req.params.id; // Pre-Validated

	const title = _req.body?.title?.trim();
	const description = _req.body?.description?.trim();
	const status = _req.body?.status?.trim();
	const assignee = Number(_req.body?.assignee?.trim());
	const project = Number(_req.body?.project?.trim());

	try {
		const response = await updateTask(id, title, description, status, assignee, project);
		if (response === null) {
			_res.status(400).json({ error: "No valid changes in request" });
		} else if (response.rows.length === 0) {
			_res.status(404).json({ error: "Task not found" });
		} else {
			_res.status(200).json({
				task: response.rows[0]
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

async function updateTask(id: any,
	title: any,
	description: any,
	status: any,
	assignee: any,
	project: any
) {

	const queryValues = [];

	var query = `UPDATE tasks SET`

	var needsComma = false;
	var nextParamCount = 1;

	if (title) {
		query += ` title=$${nextParamCount}`;
		queryValues.push(title);
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

	if (status) {
		if (needsComma) {
			query += `, `;
		}
		query += ` status=$${nextParamCount}`;
		queryValues.push(status);
		nextParamCount++;
		needsComma = true;
	}

	if (assignee || assignee === 0) {
		if (needsComma) {
			query += `, `;
		}
		query += ` assignee=$${nextParamCount}`;
		queryValues.push(assignee);
		nextParamCount++;
		needsComma = true;
	}

	if (project || project === 0) {
		if (needsComma) {
			query += `, `;
		}
		query += ` project=$${nextParamCount}`;
		queryValues.push(project);
		nextParamCount++;
		needsComma = true;
	}

	query += `, updated_at=NOW() WHERE id=$${nextParamCount} RETURNING id::int, title, description, status, assignee, project, created_at AS "createdAt", updated_at AS "updatedAt"`;
	queryValues.push(id);

	if (needsComma) {
		return pool.query(query, queryValues);
	}

	return null;
}