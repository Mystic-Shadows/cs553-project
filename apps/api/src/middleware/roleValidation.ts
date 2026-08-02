import { pool } from "../db/pool";

export function requireRole(...roles: any) {
    return (req: any, res: any, next: any) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: "Forbidden",
                message: `This action requires one of these roles: ${roles.join(", ")}.`
            });
        }

        next();
    };
}

export async function isOwner(user_id: any, project_id: any) {

    const response = await pool.query(
        `SELECT *
		FROM projects
		WHERE owner=$1 AND id=$2`, [user_id, project_id]
    );

    if (response.rows.length !== 0) {
        return true;
    }

    return false;
}

export async function isMember(user_id: any, project_id: any) {
    if (await isOwner(user_id, project_id)) {
        return true;
    }

    const response = await pool.query(
        `SELECT *
		FROM authorizations
		WHERE user_id=$1 AND project_id=$2`, [user_id, project_id]
    );

    if (response.rows.length !== 0) {
        return true;
    }

    return false
}