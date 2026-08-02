import { pool } from "../db/pool";
import { isMember } from "../middleware/roleValidation";

export async function putTasks(_req: any, _res: any) {
	const title = _req.body.title.trim(); // Pre-Validated
	const id = _req.params.id; // Pre-Validated

	const description = _req.body?.description?.trim();
	const status = _req.body?.status?.trim();
	const assignee = Number(_req.body?.assignee?.trim());
	const project = Number(_req.body?.project?.trim());

	try {
		const info = await pool.query(
			`SELECT project
			FROM tasks
			WHERE id=$1 `, [id]
		);

		const project_sel = info?.rows[0]?.project;
		if (_req.user.role !== "admin" && project_sel && !(await isMember(_req.user.sub, project_sel))) {
			return _res.status(403).json({
				error: "Forbidden",
				message: `This action requires one of these roles: admin, member (of project).`
			});
		}

		const response = await makeTask(id, title, description, status, assignee, project);

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
			database: "disconnected",
		});
	}
}

async function makeTask(id: any, title: any, description: any, status: any, assignee: any, project: any) {

	// must set defaults if needed (for update section)
	if (!description) {
		description = ``;
	}
	if (!status || status === "") {
		status = `todo`;
	}
	if (!assignee) {
		assignee = 0;
	}
	if (!project) {
		project = 0;
	}

	const queryValues = [id, title, description, status, assignee, project];
	const query = `INSERT INTO tasks (id, title, description, status, assignee, project)
				   VALUES ($1, $2, $3, $4, $5, $6)
				   ON CONFLICT (id)
				   DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, status=EXCLUDED.status, assignee=EXCLUDED.assignee, project=EXCLUDED.project, updated_at=NOW()
				   RETURNING id::int, title, description, status, assignee, project, created_at AS "createdAt", updated_at AS "updatedAt"`;

	return pool.query(query, queryValues);
}