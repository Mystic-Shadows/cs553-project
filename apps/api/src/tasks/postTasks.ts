import { pool } from "../db/pool";

export async function postTasks(_req: any, _res: any) {
	const title = _req.body.title.trim(); // Pre-Validated

	const description = _req.body?.description?.trim();
	const status = _req.body?.status?.trim();

	try {
		const response = await makeTask(title, description, status);

		_res.status(201).json({
			task: response.rows[0]
		});

	} catch (error) {
		console.log(`${error}`)
		_res.status(500).json({
			status: "error",
			message: "Failed to create task",
		});
	}
}

async function makeTask(title: any, description: any, status: any) {
	var queryHeaders = `title`;
	var queryPlaceholders = `$1`;
	const queryValues = [title];

	if (description) {
		queryHeaders += `, description`;
		queryPlaceholders += `, $2`;
		queryValues.push(description);
	}

	if (status) {
		queryHeaders += `, status`;
		if (queryValues.length == 2) {
			queryPlaceholders += `, $3`;
		} else {
			queryPlaceholders += `, $2`;
		}
		queryValues.push(status);
	}

	const query = `INSERT INTO tasks (${queryHeaders}) VALUES (${queryPlaceholders}) RETURNING id::int, title, description, status, created_at AS "createdAt", updated_at AS "updatedAt"`;

	return pool.query(query, queryValues);
}