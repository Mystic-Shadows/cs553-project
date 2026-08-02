import { pool } from "../db/pool";
import { isOwner } from "../middleware/roleValidation";

export async function postAuthorizations(_req: any, _res: any) {
	const user = Number(_req.body.userId.trim()); // Pre-Validated
	const project = Number(_req.body.projectId.trim()); // Pre-Validated

	if (_req.user.role !== "admin" && !(await isOwner(_req.user.sub, project))) {
		return _res.status(403).json({
			error: "Forbidden",
			message: `This action requires one of these roles: admin, owner (of project).`
		});
	}

	try {
		const response = await makeAuthorization(user, project);
			
			_res.status(201).json({
				authorization: response.rows[0]
			});

	} catch (error: any) {

		if (error.code === '23505') {
			return _res.status(400).json({
				error: "Bad Request", message: "Authorization already exists"
			});
		}
		console.log(`${error}`)
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}

async function makeAuthorization(user: any, project: any) {
	const query = `INSERT INTO authorizations (user_id, project_id) VALUES ($1, $2) RETURNING user_id as "userId", project_id AS "projectId"`;
	return pool.query(query, [user, project]);
}