import { API_BASE_URL, authHeaders } from "./../env.js";

/* 
    INPUT
*/
const getAuthorizationsButton = document.querySelector("#get-authorizations");

/*
    OUTPUT
*/
const getAuthorizationsList = document.querySelector("#authorizations");

/*
    FUNCTIONS
*/
async function getAuthorizations() {
    try {
        const response = await fetch(`${API_BASE_URL}/authorizations`, { headers: authHeaders() });

        if (!response.ok) {
            throw new Error(`GET /authorizations failed with status ${response.status}`);
        }

        const data = await response.json();

        getAuthorizationsList.replaceChildren();
        for (const authorization of data.authorizations) {
            const li = document.createElement("li");
            li.textContent = `Non-Owner User ${authorization.userId} can access Project ${authorization.projectId}`;
            getAuthorizationsList.appendChild(li);
        }

    } catch (error) {
        getAuthorizationsList.replaceChildren();
        const li = document.createElement("li");
        li.textContent = `Error Retrieving Users: ${error.message}`
        getAuthorizationsList.appendChild(li);
    }
}
getAuthorizationsButton.addEventListener("click", getAuthorizations);
