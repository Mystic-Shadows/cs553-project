import { API_BASE_URL, authHeaders } from "./../env.js";

/* 
    INPUT
*/
const getProjectsButton = document.querySelector("#get-projects");

/*
    OUTPUT
*/
const getProjectsList = document.querySelector("#projects");

/*
    FUNCTIONS
*/
async function getProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`, { headers: authHeaders() });

        if (!response.ok) {
            throw new Error(`GET /tasks failed with status ${response.status}`);
        }

        const data = await response.json();

        getProjectsList.replaceChildren();
        for (const project of data.projects) {
            const li = document.createElement("li");
            li.textContent = `${project.id}. ${project.owner}:${project.project} ${project.description} (${project.createdAt}/${project.updatedAt})`;
            getProjectsList.appendChild(li);
        }

    } catch (error) {
        getProjectsList.replaceChildren();
        const li = document.createElement("li");
        li.textContent = `Error Retrieving Projects: ${error.message}`
        getProjectsList.appendChild(li);
    }
}
getProjectsButton.addEventListener("click", getProjects);
