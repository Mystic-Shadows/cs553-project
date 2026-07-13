import { API_BASE_URL } from "./env.js";

/* 
    INPUT
*/
const patchTaskForm = document.querySelector("#patch-task-form");
const patchTaskId = document.querySelector("#patch-task-id");
const patchTaskTitle = document.querySelector("#patch-task-title");
const patchTaskDescription = document.querySelector("#patch-task-description");
const patchTaskStatus = document.querySelector("#patch-task-status");

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
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title })
            })
        } else if (clickedButton.value === "description") {
            if (!description) {
                patchTaskText.textContent = `Invalid description Submitted`;
                return;
            }
            response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ description })
            })
        } else if (clickedButton.value === "status") {
            if (!status) {
                patchTaskText.textContent = `Invalid status Submitted`;
                return;
            }
            response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status })
            })
        }

        if (response.status === 400) {
            patchTaskText.textContent = `Server Rejected Data: Bad Request`;
        } else if (response.status === 404) {
            patchTaskText.textContent = `Server Rejected Data: Original Item not Found`;
        } else if (!response.ok) {
            throw new Error(`PUT /api/tasks failed with status ${response.status}`);
        } else {
            const data = await response.json();
            const task = data.task;
            patchTaskText.textContent = `Updated the task => ${task.id}. ${task.title}: [${task.status}] ${task.description} (${task.createdAt}/${task.updatedAt})`;
        }

    } catch (error) {
        patchTaskText.textContent = `Error Editing Task ${id}: ${error.message}`;
    }

}
patchTaskForm.addEventListener("submit", async (event) => { patchTask(event) });