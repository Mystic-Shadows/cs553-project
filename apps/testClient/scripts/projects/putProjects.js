import { API_BASE_URL, authHeaders } from "./../env.js";

/* 
    INPUT
*/
const putProjectForm = document.querySelector("#put-project-form");
const putProjectId = document.querySelector("#put-project-id");
const putProjectName = document.querySelector("#put-project-name");
const putProjectDescription = document.querySelector("#put-project-description");

/*
    OUTPUT
*/
const putProjectText = document.querySelector("#put-project-status");

/*
    FUNCTIONS
*/
async function putProjects(event) {
    event.preventDefault();

    const id = putProjectId.value;
    const name = putProjectName.value.trim();
    const description = putProjectDescription.value.trim();

    if (!name) {
        putProjectText.textContent = `Invalid Task Submitted`;
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: "PUT",
            headers: authHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ project: name, description: description })
        })

        if (response.status === 400) {
            putProjectText.textContent = `Server Rejected Data: Bad Request`;
        } else if (!response.ok) {
            throw new Error(`PUT /projects/${id} failed with status ${response.status}`);
        } else {
            const data = await response.json();
            const project = data.project;
            console.log(project);
            putProjectText.textContent = `Updated or made project => ${project.id}. ${project.project} (${project.createdAt}/${project.updatedAt})`;
        }

    } catch (error) {
        putProjectText.textContent = `Error Updating or Creating Project: ${error.message}`;
    }


}
putProjectForm.addEventListener("submit", async (event) => { putProjects(event) });