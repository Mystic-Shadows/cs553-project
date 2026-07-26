import { pool } from "../db/pool";

export async function validateProjects(_req: any, _res: any, _next: any) {

    if (!validateTypes(_req)) {
        return _res.status(400).json({ error: "Bad Request", message: "Incorrect Types" });
    }

    if (["POST", "PUT", "PATCH"].includes(_req.method) && !validateProject(_req)) {
        return _res.status(400).json({ error: "Bad Request", message: "Missing or Malformed Project" });
    }

    _next();
}

function validateTypes(_req: any) {
    const project = _req.body?.project;

    if (project !== undefined && typeof project !== 'string') {
        return false;
    }

    return true;
}

function validateProject(_req: any) {
    const project = _req.body?.project?.trim();
    if (project && project !== "") {
        return true;
    } else {
        return false;
    }
}

// ===== ===== ===== =====
// ID Validation
// ===== ===== ===== =====
export async function validateProjectsId(_req: any, _res: any, _next: any) {
    const id = _req.params.id;

    if (!(Boolean(id) && Number(id)) && Number(id) != 0) { // If not a number
        return _res.status(400).json({ error: "Bad Request", message: "ID not a Number" });
    }

    if (!(Number(id) > 0)) {
        return _res.status(400).json({ error: "Bad Request", message: "ID should not be 0 or less" });
    }

    try {
        const response = await pool.query(`SELECT last_value + 1 AS "nextId" FROM projects_id_seq;`);

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