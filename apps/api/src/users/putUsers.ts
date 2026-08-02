import { pool } from "../db/pool";
import bcrypt from "bcryptjs";

export async function putUsers(_req: any, _res: any) {
	const username = _req.body.username.trim(); // Pre-Validated
	const password = _req.body.password.trim(); // Pre-Validated
	const id = _req.params.id; // Pre-Validated
	const email = _req.body?.email;
	const role = _req.body?.role;

	try {
		const response = await makeUser(id, username, email, role, password);

		if (response.rows[0].updatedAt.getTime() === response.rows[0].createdAt.getTime()) {
			_res.status(201).json({
				user: response.rows[0]
			});
		} else {
			_res.status(200).json({
				user: response.rows[0]
			});
		}

	} catch (error) {
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}

async function makeUser(id: any, username: any, email: any, role: any, password: any) {

	if (!email) {
		email = "";
	}

	if (!role) {
		role = "user";
	}

	// must set defaults if needed (for update section)
	const passwordHash = await bcrypt.hash(password, 10);
	const queryValues = [id, username, email, role, passwordHash];
	const query = `INSERT INTO users (id, username, email, role, password_hash)
				   VALUES ($1, $2, $3, $4, $5)
				   ON CONFLICT (id)
				   DO UPDATE SET username=EXCLUDED.username, email=EXCLUDED.email, role=EXCLUDED.role, password_hash=EXCLUDED.password_hash, updated_at=NOW()
				   RETURNING id::int, username, email, role, created_at AS "createdAt", updated_at AS "updatedAt"`;

	return pool.query(query, queryValues);
}