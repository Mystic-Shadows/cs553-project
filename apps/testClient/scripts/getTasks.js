import { API_BASE_URL } from "./env.js";

/* 
    INPUT
*/
const getTasksButton = document.querySelector("#get-tasks");

/*
    OUTPUT
*/
const getTasksList = document.querySelector("#tasks");

/*
    FUNCTIONS
*/
async function getTasks() {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`);

        if (!response.ok) {
            throw new Error(`GET /tasks failed with status ${response.status}`);
        }

        const data = await response.json();

        getTasksList.replaceChildren();
        for (const task of data.tasks) {
            const li = document.createElement("li");
            li.textContent = `${task.id}. ${task.title}: [${task.status}] ${task.description} (${task.createdAt}/${task.updatedAt})`;
            getTasksList.appendChild(li);
        }

    } catch (error) {
        getTasksList.replaceChildren();
        const li = document.createElement("li");
        li.textContent = `Error Retrieving Tasks: ${error.message}`
        getTasksList.appendChild(li);
    }
}
getTasksButton.addEventListener("click", getTasks);
