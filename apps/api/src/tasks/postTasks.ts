import { pool } from "../db/pool";

export async function postTasks(_req: any, _res: any) {
	const title = _req.body.title.trim(); // Pre-Validated

	const description = _req.body?.description?.trim();
	const status = _req.body?.status?.trim();
	const assignee = Number(_req.body?.assignee?.trim());
	const project = Number(_req.body?.project?.trim());

	try {
		const response = await makeTask(title, description, status, assignee, project);

		_res.status(201).json({
			task: response.rows[0]
		});

	} catch (error) {
		console.log(`${error}`)
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}

async function makeTask(title: any, description: any, status: any, assignee: any, project: any) {
	var queryHeaders = `title`;
	var queryPlaceholders = `$1`;
	const queryValues = [title];
	var nextParamCount = 2;

	if (description) {
		queryHeaders += `, description`;
		queryPlaceholders += `, $${nextParamCount}`;
		queryValues.push(description);
	}

	if (status) {
		queryHeaders += `, status`;
		queryPlaceholders += `, $${nextParamCount}`;
		queryValues.push(status);
	}

	if (assignee) {
		queryHeaders += `, assignee`;
		queryPlaceholders += `, $${nextParamCount}`;
		queryValues.push(assignee);
	}

	if (project) {
		queryHeaders += `, project`;
		queryPlaceholders += `, $${nextParamCount}`;
		queryValues.push(project);
	}

	const query = `INSERT INTO tasks (${queryHeaders}) VALUES (${queryPlaceholders}) RETURNING id::int, title, description, status, assignee, project, created_at AS "createdAt", updated_at AS "updatedAt"`;

	return pool.query(query, queryValues);
}