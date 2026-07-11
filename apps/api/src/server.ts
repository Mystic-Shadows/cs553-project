import express from "express";
import { env } from "./config/env";

import { logRequest } from "./middleware/requestLogger"
import { validateRequest } from "./middleware/validator"

import { health } from "./health/health"
import { dbHealth } from "./health/dbHealth"

import { getTasks } from "./tasks/getTasks"
import { postTasks } from "./tasks/postTasks"

const app = express();

// Initial Middleware
app.use(logRequest)
app.use(express.json());
app.use(validateRequest)

// Health Routes
app.get("/health", health);
app.get("/db-health", dbHealth);

// Task Routes
app.get("/tasks", getTasks);
app.post("/tasks", postTasks);

// Final Middleware
app.use((_req, res) => { res.status(404).json({ error: "Not found" }); });



app.listen(env.port, () => {
	console.log(`Server running at http://localhost:${env.port}`);
});
