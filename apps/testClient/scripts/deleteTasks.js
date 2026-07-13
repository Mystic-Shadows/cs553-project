import { API_BASE_URL } from "./env.js";

/* 
    INPUT
*/
const deleteTaskForm = document.querySelector("#delete-task-form");
const deleteTaskId = document.querySelector("#delete-task-id");

/*
    OUTPUT
*/
const deleteTaskText = document.querySelector("#delete-status");

/*
    FUNCTIONS
*/
async function deleteTask(event) {
    event.preventDefault();

    const id = Number(deleteTaskId.value);

    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, { method: "DELETE" });
        if (response.status === 404) {
            deleteTaskText.textContent = `Task ${id} not found`;
        } else if (!response.ok) {
            throw new Error(`DELETE /api/tasks failed with status ${response.status}`);
        } else {
            deleteTaskText.textContent = `Successfully deleted task ${id}`;
        }

    } catch (error) {
        deleteTaskText.textContent = `Error Deleting Task ${id}: ${error.message}`;
    }

}
deleteTaskForm.addEventListener("submit", async (event) => { deleteTask(event) });
