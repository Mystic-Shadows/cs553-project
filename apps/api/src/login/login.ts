import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool";
import { jwtSecret, jwtExpiresIn } from "../env";

export async function login(_req: any, _res: any) {
    const username = _req.body?.username?.trim();
    const password = _req.body?.password;

    if (!username || !password) {
        return _res.status(400).json({
            error: "Bad Request",
            message: "Username and password are required."
        });
    }

    try {
        const result = await pool.query(
            "SELECT id, username, password_hash, role FROM users WHERE username = $1",
            [username]
        );
        const user = result.rows[0];

        // Use the same response for an unknown username and a wrong password.
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return _res.status(401).json({
                error: "Unauthorized",
                message: "Invalid username or password."
            });
        }

        const token = jwt.sign(
            { sub: String(user.id), username: user.username, role: user.role },
            jwtSecret,
            { expiresIn: jwtExpiresIn }
        );

        _res.json({
            accessToken: token,
            tokenType: "Bearer",
            expiresIn: jwtExpiresIn,
            user: { id: user.id, username: user.username, role: user.role }
        });
    } catch (error) {
        console.error("Login failed:", error);
        _res.status(500).json({ error: "Internal Server Error", message: "Login failed." });
    }
}