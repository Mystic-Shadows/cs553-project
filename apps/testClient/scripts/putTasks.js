import { API_BASE_URL } from "./env.js";

/* 
    INPUT
*/
const putTaskForm = document.querySelector("#put-task-form");
const putTaskId = document.querySelector("#put-task-id");
const putTaskTitle = document.querySelector("#put-task-title");
const putTaskDescription = document.querySelector("#put-task-description");
const putTaskStatus = document.querySelector("#put-task-status");
const putTaskAssignee = document.querySelector("#put-task-assignee");
const putTaskProject = document.querySelector("#put-task-project");

/*
    OUTPUT
*/
const putTaskText = document.querySelector("#put-status");

/*
    FUNCTIONS
*/
async function putTasks(event) {
    event.preventDefault();

    const id = putTaskId.value;
    const title = putTaskTitle.value.trim();
    const description = putTaskDescription.value.trim();
    const status = putTaskStatus.value.trim();
    const assignee = putTaskAssignee.value;
    const project = putTaskProject.value;

    if (!title) {
        putTaskText.textContent = `Invalid Task Submitted`;
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, description, status, assignee, project })
        })

        if (response.status === 400) {
            putTaskText.textContent = `Server Rejected Data: Bad Request`;
        } else if (!response.ok) {
            throw new Error(`PUT /tasks failed with status ${response.status}`);
        } else {
            const data = await response.json();
            const task = data.task;
            console.log(task);
            putTaskText.textContent = `Updated or made task => ${task.id}. ${task.project}/${task.title}: [${task.status}] {${task.assignee}} ${task.description} (${task.createdAt}/${task.updatedAt})`;
        }

    } catch (error) {
        putTaskText.textContent = `Error Updating or Creating Task: ${error.message}`;
    }


}
putTaskForm.addEventListener("submit", async (event) => { putTasks(event) });