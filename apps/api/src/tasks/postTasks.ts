import { pool } from "../db/pool";

export async function postTasks(_req: any, _res: any) {
	const title = _req.body.title.trim(); // Pre-Validated

	const description = _req.body?.description?.trim();
	const status = _req.body?.status?.trim();

	try {
		const response = await makeTask(title, description, status);

		_res.status(201).json({
			id: response.rows[0],
			title: response.rows[1],
			description: response.rows[2],
			status: response.rows[3],
			created_at: response.rows[4],
			updated_at: response.rows[5],
		});

	} catch (error) {
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
		queryPlaceholders += `, $3`;
		queryValues.push(status);
	}

	const query = `INSERT INTO tasks (${queryHeaders}) VALUES (${queryPlaceholders}) RETURNING id::int, title, description, status, created_at, updated_at`;

	return pool.query(query, queryValues);
}