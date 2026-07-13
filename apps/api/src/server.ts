import express from "express";
import cors from "cors";
import { env } from "./config/env";

import { logRequest } from "./middleware/requestLogger";
import { validateRequest } from "./middleware/validator";
import { validateId } from "./middleware/idValidator";

import { health } from "./health/health";
import { dbHealth } from "./health/dbHealth";

import { getTasks } from "./tasks/getTasks";
import { getTask } from "./tasks/getTask";
import { postTasks } from "./tasks/postTasks";
import { putTasks } from "./tasks/putTasks"
import { deleteTasks } from "./tasks/deleteTasks"
import { patchTasks } from "./tasks/patchTasks"

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]
}));

// Initial Middleware
app.use(logRequest);
app.use(express.json());
app.use(validateRequest);
app.use("/tasks/:id", validateId);

// Health Routes
app.get("/health", health);
app.get("/db-health", dbHealth);

// Task Routes
app.get("/tasks", getTasks);
app.post("/tasks", postTasks);
app.get("/tasks/:id", getTask);
app.put("/tasks/:id", putTasks);
app.delete("/tasks/:id", deleteTasks);
app.patch("/tasks/:id", patchTasks);

// Final Middleware
app.use((_req, res) => { res.status(404).json({ error: "Not found" }); });



app.listen(env.port, () => {
	console.log(`Server running at http://localhost:${env.port}`);
});
