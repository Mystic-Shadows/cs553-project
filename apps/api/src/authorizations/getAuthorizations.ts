import { pool } from "../db/pool";
import { isOwner } from "../middleware/roleValidation";

export async function getAuthorizations(_req: any, _res: any) {
	try {
		const response = await pool.query(
			`SELECT user_id AS "userId",
					project_id AS "projectId"
			FROM authorizations
			ORDER BY user_id `,
		);

		if (_req.user.role === "admin") {
			_res.json({ authorizations: response.rows });
		} else {
			const authorizations = [];
			for (var authorization of response.rows) {
				if (authorization.userId == _req.user.sub  || await isOwner(_req.user.sub, authorization.projectId)) {
					authorizations.push(authorization);
				}
			}
			_res.json({ authorizations });
		}
		
	} catch (error) {
		console.error("Failed to fetch authorizations:", error);
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}