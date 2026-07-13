import { pool } from "../db/pool";

export async function putTasks(_req: any, _res: any) {
	const title = _req.body.title.trim(); // Pre-Validated
	const id = _req.params.id; // Pre-Validated

	const description = _req.body?.description?.trim();
	const status = _req.body?.status?.trim();

	try {
		const response = await makeTask(id, title, description, status);

		if (response.rows[0].updatedAt.getTime() === response.rows[0].createdAt.getTime()) {
			_res.status(201).json({
				task: response.rows[0]
			});
		} else {
			_res.status(200).json({
				task: response.rows[0]
			});
		}

	} catch (error) {
		_res.status(500).json({
			status: "error",
			message: "Failed to create task",
		});
	}
}

async function makeTask(id: any, title: any, description: any, status: any) {

	// must set defaults if needed (for update section)
	if (!description || description === "") {
		description = null;
	}
	if (!status || status === "") {
		status = `todo`;
	}

	const queryValues = [id, title, description, status];
	const query = `INSERT INTO tasks (id, title, description, status)
				   VALUES ($1, $2, $3, $4)
				   ON CONFLICT (id)
				   DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, status=EXCLUDED.status, updated_at=NOW()
				   RETURNING id::int, title, description, status, created_at AS "createdAt", updated_at AS "updatedAt"`;

	return pool.query(query, queryValues);
}