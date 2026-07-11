import { pool } from "../db/pool";

export async function dbHealth(_req: any, _res: any) {
	try {
		const result = await pool.query("SELECT NOW() AS current_time");
		_res.json({
			status: "ok",
			database: "connected",
			currentTime: result.rows[0].current_time,
		});
	} catch (error) {
		console.error("Database health check failed:", error);
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}