import { API_BASE_URL, authHeaders } from "./../env.js";

/* 
    INPUT
*/
const postProjectForm = document.querySelector("#post-project-form");
const postProjectName = document.querySelector("#post-project-name");
const postProjectDescription = document.querySelector("#post-project-description");

/*
    OUTPUT
*/
const postProjectText = document.querySelector("#post-project-status");

/*
    FUNCTIONS
*/
async function postProject(event) {
    event.preventDefault();

    const name = postProjectName.value.trim();
    const description = postProjectDescription.value.trim();

    if (!name) {
        postProjectText.textContent = `Invalid Project Submitted`;
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: "POST",
            headers: authHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ project: name, description: description })
        })

        if (response.status === 400) {
            postProjectText.textContent = `Server Rejected Data: Bad Request`;
        } else if (!response.ok) {
            throw new Error(`POST /projects failed with status ${response.status}`);
        } else {
            const data = await response.json();
            const project = data.project;
            console.log(project);
            postProjectText.textContent = `Made the following project => ${project.id}. ${project.owner}:${project.project} ${project.description} (${project.createdAt}/${project.updatedAt})`;
        }

    } catch (error) {
        postProjectText.textContent = `Error Creating Project: ${error.message}`;
    }


}
postProjectForm.addEventListener("submit", async (event) => { postProject(event) });