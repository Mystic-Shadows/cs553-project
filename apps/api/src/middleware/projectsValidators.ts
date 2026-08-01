import { pool } from "../db/pool";
import { doesUserExist } from "./usersValidators";

export async function validateProjects(_req: any, _res: any, _next: any) {

    if (!validateTypes(_req)) {
        return _res.status(400).json({ error: "Bad Request", message: "Incorrect Types" });
    }

    if (["POST", "PUT"].includes(_req.method) && !validateProject(_req)) {
        return _res.status(400).json({ error: "Bad Request", message: "Missing or Malformed Project" });
    }

    if (_req.body?.owner !== undefined && _req.body?.owner?.trim() !== "") {
        var optResponse = await doesUserExist(Number(_req.body?.owner));
        if (optResponse[0] && !optResponse[1]) { // does not exist
            return _res.status(404).json({ error: "User not found" });
        } else if (!optResponse[0]) { //error occurred
            return _res.status(500).json({ status: "error", message: "Failed to find User" });
        }
    }

    _next();
}

function validateTypes(_req: any) {
    const project = _req.body?.project;
    const description = _req.body?.description;
    const owner = _req.body?.owner;

    if ((project !== undefined && typeof project !== 'string') ||
        (description !== undefined && typeof description !== 'string') ||
        (owner !== undefined && isNaN(owner))
    ) {
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
    const id = Number(_req.params.id);

    if (!(Boolean(id) && Number(id)) && Number(id) != 0) { // If not a number
        return _res.status(400).json({ error: "Bad Request", message: "ID not a Number" });
    }

    if (!(Number(id) > 0)) {
        return _res.status(404).json({ error: "Bad Request", message: "ID should not be 0 or less" });
    }

    try {
        const response = await pool.query(`SELECT last_value + 1 AS "nextId" FROM projects_id_seq;`);

        if (!(id < response.rows[0].nextId)) {
            return _res.status(404).json({ error: "Bad Request", message: "ID number is greater than the current max key!" });
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

// Returns [Boolean, Some Value] as an optional:
// [True, True] Project Exists
// [True, False] Project Does Not Exist
// [False, Error] Error when accessing DB
export async function doesProjectExist(project: number) {
    try {

        const response = await pool.query(`SELECT project FROM projects WHERE id=$1 `, [project]);

        if (response.rows.length == 0) {
            return [true, false];
        } else {
            return [true, true];
        }

    } catch (error) {
        return [false, error]
    }
}