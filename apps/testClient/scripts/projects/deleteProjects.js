import { API_BASE_URL, authHeaders } from "./../env.js";

/* 
    INPUT
*/
const deleteProjectForm = document.querySelector("#delete-project-form");
const deleteProjectId = document.querySelector("#delete-project-id");

/*
    OUTPUT
*/
const deleteProjectText = document.querySelector("#delete-project-status");

/*
    FUNCTIONS
*/
async function deleteProject(event) {
    event.preventDefault();

    const id = Number(deleteProjectId.value);

    try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, { headers: authHeaders(), method: "DELETE" });
        if (response.status === 404) {
            deleteProjectText.textContent = `Project ${id} not found`;
        } else if (!response.ok) {
            throw new Error(`DELETE /api/projects/${id} failed with status ${response.status}`);
        } else {
            deleteProjectText.textContent = `Successfully deleted project ${id}`;
        }

    } catch (error) {
        deleteProjectText.textContent = `Error Deleting Project ${id}: ${error.message}`;
    }

}
deleteProjectForm.addEventListener("submit", async (event) => { deleteProject(event) });
