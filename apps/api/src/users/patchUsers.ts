import { pool } from "../db/pool";
import bcrypt from "bcryptjs";

export async function patchUsers(_req: any, _res: any) {
	const username = _req.body?.username?.trim(); // Pre-Validated
	const password = _req.body?.password?.trim(); // Pre-Validated
	const id = Number(_req.params.id);
	const email = _req.body?.email;
	const role = _req.body?.role;

	if (_req.user.role !== "admin" && _req.user.sub != id) {
		return _res.status(403).json({
			error: "Forbidden",
			message: `This action requires one of these roles: admin, self==id.`
		});
	}

	try {
		const response = await patchUser(id, username, email, role, password, _req.user.role);

		if (!response) {
			return _res.status(403).json({
				error: "Forbidden",
				message: `This action requires one of these roles: admin.`
			});
		} else if (response === null) {
			_res.status(400).json({ error: "No valid changes in request" });
		} else if (response.rows.length === 0) {
			_res.status(404).json({ error: "User not found" });
		} else {
			_res.status(200).json({
				user: response.rows[0]
			});
		}

	} catch (error: any) {
		if (error.code === '23505') {
			return _res.status(400).json({
				error: "Bad Request", message: "Username already exists"
			});
		}
		console.log(`${error}`)
		_res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
}

async function patchUser(id: any, username: any, email: any, role: any, password: any, current_role: any) {

	const queryValues = [];

	var query = `UPDATE users SET`

	var needsComma = false;
	var nextParamCount = 1;

	if (username) {
		query += ` username=$${nextParamCount}`;
		queryValues.push(username);
		nextParamCount++;
		needsComma = true;
	}

	if (email || email === "") { // can be 'empty'
		if (needsComma) {
			query += `, `;
		}
		query += ` email=$${nextParamCount}`;
		queryValues.push(email);
		nextParamCount++;
		needsComma = true;
	}

	if (role) {
		if (current_role !== "admin") {
			return false;
		}
		if (needsComma) {
			query += `, `;
		}
		query += ` role=$${nextParamCount}`;
		queryValues.push(role);
		nextParamCount++;
		needsComma = true;
	}

	if (password) {
		if (needsComma) {
			query += `, `;
		}
		query += ` password_hash=$${nextParamCount}`;
		queryValues.push(await bcrypt.hash(password, 10));
		nextParamCount++;
		needsComma = true;
	}

	query += `, updated_at=NOW() WHERE id=$${nextParamCount} RETURNING id::int, username, email, role, created_at AS "createdAt", updated_at AS "updatedAt"`;
	queryValues.push(id);

	if (needsComma) {
		return pool.query(query, queryValues);
	}

	return null;
}