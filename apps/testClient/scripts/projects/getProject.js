import { API_BASE_URL, authHeaders } from "./../env.js";

/* 
    INPUT
*/
// Get Task
const getProjectForm = document.querySelector("#get-project-form");
const getProjectId = document.querySelector("#get-project-id");

/*
    OUTPUT
*/
const getProjectText = document.querySelector("#project");


/*
    FUNCTIONS
*/
async function getProject(event) {
    event.preventDefault();

    const id = getProjectId.value;

    try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, { headers: authHeaders() });
        if (response.status === 404) {
            getProjectText.textContent = `Project ${id} not found`;
        } else if (!response.ok) {
            throw new Error(`GET /projects/:id failed with status ${response.status}`);
        } else {
            const project = await response.json();
            getProjectText.textContent = `${project.id}. ${project.owner}:${project.project} ${project.description} (${project.createdAt}/${project.updatedAt})`;
        }

    } catch (error) {
        getProjectText.textContent = `Error Retrieving Project ${id}: ${error.message}`;
    }

}
getProjectForm.addEventListener("submit", async (event) => { getProject(event) });