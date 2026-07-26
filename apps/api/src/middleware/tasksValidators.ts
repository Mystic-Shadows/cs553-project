import { pool } from "../db/pool";

export async function validateTasks(_req: any, _res: any, _next: any) {

    if (!validateTypes(_req)) {
        return _res.status(400).json({ error: "Bad Request", message: "Incorrect Types" });
    }

    if (["POST", "PUT"].includes(_req.method) && !validateTitle(_req)) {
        return _res.status(400).json({ error: "Bad Request", message: "Missing or Malformed Title" });
    } // Patch validates the title itself since it is an optional field

    if (_req.body?.assignee !== undefined) {
        var optResponse = await doesUserExist(Number(_req.body?.assignee));
        if (optResponse[0] && !optResponse[1]) { // does not exist
            return _res.status(404).json({ error: "User not found" });
        } else if (!optResponse[0]) { //error occurred
            return _res.status(500).json({ status: "error", message: "Failed to find User" });
        }
    }

    if (_req.body?.project !== undefined) {
        var optResponse = await doesProjectExist(Number(_req.body?.project));
        if (optResponse[0] && !optResponse[1]) { // does not exist
            return _res.status(404).json({ error: "Project not found" });
        } else if (!optResponse[0]) { //error occurred
            return _res.status(500).json({ status: "error", message: "Failed to find Project" });
        }
    }

    _next();
}

function validateTypes(_req: any) {
    const title = _req.body?.title;
    const description = _req.body?.description;
    const status = _req.body?.status;
    const assignee = _req.body?.assignee?.trim();
    const project = _req.body?.project?.trim();

    if ((title !== undefined && typeof title !== 'string') ||
        (description !== undefined && typeof description !== 'string') ||
        (status !== undefined && typeof status !== 'string') ||
        (Number.isNaN(assignee)) ||
        (Number.isNaN(project))
    ) {
        return false;
    }
    
    return true;
}
function validateTitle(_req: any) {
    const title = _req.body?.title?.trim();
    if (title && title !== "") {
        return true;
    } else {
        return false;
    }
}

// Returns [Boolean, Some Value] as an optional:
// [True, True] User Exists
// [True, False] User Does Not Exist
// [False, Error] Error when accessing DB
async function doesUserExist(user: number) {
    try {
        const response = await pool.query(`SELECT username FROM users WHERE id=$1 `, [user]);

        if (response.rows.length == 0) {
            return [true, false];
        } else {
            return [true, true];
        }

    } catch (error) {
        return [false, error]
    }
}

// Returns [Boolean, Some Value] as an optional:
// [True, True] Project Exists
// [True, False] Project Does Not Exist
// [False, Error] Error when accessing DB
async function doesProjectExist(project: number) {
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



// ===== ===== ===== =====
// ID Validation
// ===== ===== ===== =====
export async function validateTasksId(_req: any, _res: any, _next: any) {
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