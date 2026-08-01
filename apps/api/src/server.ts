import express from "express";
import cors from "cors";
import { env } from "./config/env";

import { logRequest } from "./middleware/requestLogger";
import { validateTasks, validateTasksId } from "./middleware/tasksValidators";
import { validateProjects, validateProjectsId } from "./middleware/projectsValidators";
import { validateUsers, validateUsersId } from "./middleware/usersValidators";
import { validateAuthorizations } from "./middleware/authorizationsValidators";
import { authenticateToken } from "./middleware/validateToken";

import { health } from "./health/health";
import { dbHealth } from "./health/dbHealth";

import { getTasks } from "./tasks/getTasks";
import { getTask } from "./tasks/getTask";
import { postTasks } from "./tasks/postTasks";
import { putTasks } from "./tasks/putTasks";
import { deleteTasks } from "./tasks/deleteTasks";
import { patchTasks } from "./tasks/patchTasks";

import { getProjects } from "./projects/getProjects";
import { postProjects } from "./projects/postProjects";
import { getProject } from "./projects/getProject";
import { patchProjects } from "./projects/patchProjects";
import { deleteProjects } from "./projects/deleteProjects";
import { putProjects } from "./projects/putProjects";

import { getUsers } from "./users/getUsers";
import { getUser } from "./users/getUser";
import { postUsers } from "./users/postUsers";
import { putUsers } from "./users/putUsers";
import { patchUsers } from "./users/patchUsers";
import { deleteUsers } from "./users/deleteUsers";

import { getAuthorizations } from "./authorizations/getAuthorizations";
import { postAuthorizations } from "./authorizations/postAuthorizations";
import { deleteAuthorizations } from "./authorizations/deleteAuthorizations";

import { login } from "./login/login"
import { register } from "./register/register";

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

// Register/Login Routes
app.post("/login", login);
app.post("/register", register);

// Validation Middleware
app.use("/tasks", authenticateToken, validateTasks);
app.use("/tasks/:id", authenticateToken, validateTasks, validateTasksId);

app.use("/projects", authenticateToken, validateProjects);
app.use("/projects/:id", authenticateToken, validateProjects, validateProjectsId);

app.use("/users", authenticateToken, validateUsers);
app.use("/users/:id", authenticateToken, validateUsers, validateUsersId);

app.use("/authorizations", authenticateToken, validateAuthorizations);

// Health Routes
app.get("/health", health);
app.get("/db-health", authenticateToken, dbHealth);

// Task Routes
app.get("/tasks", getTasks);
app.post("/tasks", postTasks);
app.get("/tasks/:id", getTask);
app.put("/tasks/:id", putTasks);
app.delete("/tasks/:id", deleteTasks);
app.patch("/tasks/:id", patchTasks);

// Project Routes
app.get("/projects", getProjects);
app.post("/projects", postProjects);
app.get("/projects/:id", getProject);
app.patch("/projects/:id", patchProjects);
app.delete("/projects/:id", deleteProjects);
app.put("/projects/:id", putProjects);

// User Routes
app.get("/users", getUsers);
app.post("/users", postUsers);
app.get("/users/:id", getUser);
app.patch("/users/:id", patchUsers);
app.delete("/users/:id", deleteUsers);
app.put("/users/:id", putUsers);

// Authorization Routes
app.get("/authorizations", getAuthorizations);
app.post("/authorizations", postAuthorizations);
app.delete("/authorizations", deleteAuthorizations);

// Final Middleware
app.use((_req, res) => { res.status(404).json({ error: "Not found" }); });



app.listen(env.port, () => {
	console.log(`Server running at http://localhost:${env.port}`);
});
