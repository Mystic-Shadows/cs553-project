import { API_BASE_URL } from "./env.js";

/* 
    INPUT
*/
// Get Task
const getTaskForm = document.querySelector("#get-task-form");
const getTaskId = document.querySelector("#get-task-id");

/*
    OUTPUT
*/
const getTaskText = document.querySelector("#task");


/*
    FUNCTIONS
*/
async function getTask(event) {
    event.preventDefault();

    const id = getTaskId.value;

    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
        if (response.status === 404) {
            getTaskText.textContent = `Task ${id} not found`;
        } else if (!response.ok) {
            throw new Error(`GET /tasks/:id failed with status ${response.status}`);
        } else {
            const task = await response.json();
            getTaskText.textContent = `${task.id}. ${task.project}/${task.title}: [${task.status}] {${task.assignee}} ${task.description} (${task.createdAt}/${task.updatedAt})`;
        }

    } catch (error) {
        getTaskText.textContent = `Error Retrieving Task ${id}: ${error.message}`;
    }

}
getTaskForm.addEventListener("submit", async (event) => { getTask(event) });