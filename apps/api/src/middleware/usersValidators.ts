import { pool } from "../db/pool";

export async function validateUsers(_req: any, _res: any, _next: any) {

    if (!validateTypes(_req)) {
        return _res.status(400).json({ error: "Bad Request", message: "Incorrect Types" });
    }

    if (["POST", "PUT"].includes(_req.method) && !validateUser(_req)) {
        return _res.status(400).json({ error: "Bad Request", message: "Missing or Malformed username" });
    }

    _next();
}

function validateTypes(_req: any) {
    const username = _req.body?.username?.trim();
    const email = _req.body?.email;
    const role = _req.body?.role?.trim();

    if ((username !== undefined && typeof username !== 'string') ||
        (email !== undefined && typeof email !== 'string') ||
        (role !== "" && role !== undefined && role !== "user" && role !== "admin")
    ) {
        return false;
    }

    return true;
}

function validateUser(_req: any) {
    const username = _req.body?.username?.trim();
    if (username && username !== "") {
        return true;
    } else {
        return false;
    }
}

// ===== ===== ===== =====
// ID Validation
// ===== ===== ===== =====
export async function validateUsersId(_req: any, _res: any, _next: any) {
    const id = Number(_req.params.id);

    if (!(Boolean(id) && Number(id)) && Number(id) != 0) { // If not a number
        return _res.status(400).json({ error: "Bad Request", message: "ID not a Number" });
    }

    if (!(Number(id) > 0)) {
        return _res.status(404).json({ error: "Bad Request", message: "ID should not be 0 or less" });
    }

    try {
        const response = await pool.query(`SELECT last_value + 1 AS "nextId" FROM users_id_seq;`);

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
// [True, True] User Exists
// [True, False] User Does Not Exist
// [False, Error] Error when accessing DB
export async function doesUserExist(user: number) {
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