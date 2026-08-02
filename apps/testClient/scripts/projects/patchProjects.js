import { API_BASE_URL, authHeaders } from "./../env.js";

/* 
    INPUT
*/
const patchProjectForm = document.querySelector("#patch-project-form");
const patchProjectId = document.querySelector("#patch-project-id");
const patchProjectName = document.querySelector("#patch-project-name");
const patchProjectOwner = document.querySelector("#patch-project-owner");
const patchProjectDescription = document.querySelector("#patch-project-description");

/*
    OUTPUT
*/
const patchProjectText = document.querySelector("#patch-project-status");

/*
    FUNCTIONS
*/

async function patchProject(event) {
    event.preventDefault();

    const id = Number(patchProjectId.value);
    const name = patchProjectName.value.trim();
    const owner = patchProjectOwner.value;
    const description = patchProjectDescription.value.trim();

    const clickedButton = event.submitter;

    var response;

    try {
        if (clickedButton.value === "name") {
            if (!name) {
                patchProjectText.textContent = `Invalid name Submitted`;
                return;
            }
            response = await fetch(`${API_BASE_URL}/projects/${id}`, {
                method: "PATCH",
                headers: authHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify({ project: name })
            })
        }
        else if (clickedButton.value === "description") {
            response = await fetch(`${API_BASE_URL}/projects/${id}`, {
                method: "PATCH",
                headers: authHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify({ description })
            })
        }
        else if (clickedButton.value === "owner") {
            response = await fetch(`${API_BASE_URL}/projects/${id}`, {
                method: "PATCH",
                headers: authHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify({ owner })
            })
        }

        if (response.status === 400) {
            patchProjectText.textContent = `Server Rejected Data: Bad Request`;
        } else if (response.status === 404) {
            patchProjectText.textContent = `Server Rejected Data: Original Item not Found`;
        } else if (!response.ok) {
            throw new Error(`PUT /api/projects/${id} failed with status ${response.status}`);
        } else {
            const data = await response.json();
            const project = data.project;
            patchProjectText.textContent = `Updated the project => ${project.id}. ${project.owner}:${project.project} ${project.description} (${project.createdAt}/${project.updatedAt})`;
        }

    } catch (error) {
        patchProjectText.textContent = `Error Editing Project ${id}: ${error.message}`;
    }

}
patchProjectForm.addEventListener("submit", async (event) => { patchProject(event) });