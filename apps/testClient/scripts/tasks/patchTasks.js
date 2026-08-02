import { API_BASE_URL, authHeaders } from "./../env.js";

/* 
    INPUT
*/
const patchTaskForm = document.querySelector("#patch-task-form");
const patchTaskId = document.querySelector("#patch-task-id");
const patchTaskTitle = document.querySelector("#patch-task-title");
const patchTaskDescription = document.querySelector("#patch-task-description");
const patchTaskStatus = document.querySelector("#patch-task-status");
const patchTaskAssignee = document.querySelector("#patch-task-assignee");
const patchTaskProject = document.querySelector("#patch-task-project");

/*
    OUTPUT
*/
const patchTaskText = document.querySelector("#patch-status");

/*
    FUNCTIONS
*/

async function patchTask(event) {
    event.preventDefault();

    const id = Number(patchTaskId.value);
    const title = patchTaskTitle.value.trim();
    const description = patchTaskDescription.value.trim();
    const status = patchTaskStatus.value.trim();
    const assignee = patchTaskAssignee.value;
    const project = patchTaskProject.value;

    const clickedButton = event.submitter;

    var response;

    try {
        if (clickedButton.value === "title") {
            if (!title) {
                patchTaskText.textContent = `Invalid title Submitted`;
                return;
            }
            response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: "PATCH",
                headers: authHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify({ title })
            })
        } else if (clickedButton.value === "description") {
            response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: "PATCH",
                headers: authHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify({ description })
            })
        } else if (clickedButton.value === "status") {
            if (!status) {
                patchTaskText.textContent = `Invalid status Submitted`;
                return;
            }
            response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: "PATCH",
                headers: authHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify({ status })
            })
        } else if (clickedButton.value === "assignee") {
            if (!assignee && assignee !== 0) {
                patchTaskText.textContent = `Invalid assignee Submitted`;
                return;
            }
            response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: "PATCH",
                headers: authHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify({ assignee })
            })
        } else if (clickedButton.value === "project") {
            if (!project && project !== 0) {
                patchTaskText.textContent = `Invalid project Submitted`;
                return;
            }
            response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: "PATCH",
                headers: authHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify({ project })
            })
        }

        if (response.status === 400) {
            patchTaskText.textContent = `Server Rejected Data: Bad Request`;
        } else if (response.status === 404) {
            patchTaskText.textContent = `Server Rejected Data: Original Item not Found`;
        } else if (!response.ok) {
            throw new Error(`PUT /api/tasks/${id} failed with status ${response.status}`);
        } else {
            const data = await response.json();
            const task = data.task;
            patchTaskText.textContent = `Updated the task => ${task.id}. ${task.project}/${task.title}: [${task.status}] {${task.assignee}} ${task.description} (${task.createdAt}/${task.updatedAt})`;
        }

    } catch (error) {
        patchTaskText.textContent = `Error Editing Task ${id}: ${error.message}`;
    }

}
patchTaskForm.addEventListener("submit", async (event) => { patchTask(event) });