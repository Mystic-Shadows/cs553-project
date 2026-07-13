import { pool } from "../db/pool";

export async function getTask(_req: any, _res: any) {
    const id = _req.params.id;
	try {
		const response = await pool.query(
			`SELECT id,
                    title,
                    description,
                    status,
                    created_at AS "createdAt",
                    updated_at AS "updatedAt"
             FROM tasks
             WHERE id=$1 `, [id]
		);

		if (response.rows.length == 0) {
			_res.status(404).json({ error: "Item not found" });
		} else {
			_res.json(response.rows[0]);
		}
	} catch (error) {
		console.error("Failed to fetch tasks:", error);
		_res.status(500).json({
			status: "error",
			message: "Failed to fetch tasks",
		});
	}
}