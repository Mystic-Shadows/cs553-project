import { pool } from "../db/pool";

export async function getAuthorizations(_req: any, _res: any) {
	try {
		const response = await pool.query(
			`SELECT user_id AS "userId",
					project_id AS "projectId"
			FROM authorizations
			ORDER BY user_id `,
		);

		_res.json({ authorizations: response.rows });
	} catch (error) {
		console.error("Failed to fetch authorizations:", error);
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}