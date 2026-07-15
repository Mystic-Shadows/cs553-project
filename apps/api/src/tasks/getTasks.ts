import { pool } from "../db/pool";

export async function getTasks(_req: any, _res: any) {
	try {
		const response = await pool.query(
			`SELECT id,
                    title,
                    description,
                    status,
                    created_at AS "createdAt",
                    updated_at AS "updatedAt"
             FROM tasks
             ORDER BY id `,
		);

		_res.json({ tasks: response.rows });
	} catch (error) {
		console.error("Failed to fetch tasks:", error);
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}