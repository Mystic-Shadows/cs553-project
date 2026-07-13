import { pool } from "../db/pool";

export async function validateId(_req: any, _res: any, _next: any) {
    const id = _req.params.id;

    if (!(Boolean(id) && Number(id)) && Number(id) != 0) { // If not a number
        return _res.status(400).json({ error: "Bad Request", message: "ID not a Number" });
    }

    if (!(Number(id) > 0)) {
        return _res.status(400).json({ error: "Bad Request", message: "ID should not be 0 or less" });
    }

    try {
        const response = await pool.query(`SELECT last_value + 1 AS "nextId" FROM tasks_id_seq;`);

        if (!(id < response.rows[0].nextId)) {
            return _res.status(400).json({ error: "Bad Request", message: "ID number is greater than the current max key!" });
        }

    } catch (error) {
        console.error("Failed to Validate ID:", error);
        return _res.status(500).json({
            status: "error",
            message: "Failed to Validate ID",
        });
    }

    _next();
}