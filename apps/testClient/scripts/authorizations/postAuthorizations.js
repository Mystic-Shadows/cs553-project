import { API_BASE_URL, authHeaders } from "./../env.js";

/* 
    INPUT
*/
const postAuthorizationForm = document.querySelector("#post-authorizations-form");
const postAuthorizationUserId = document.querySelector("#post-authorizations-userId");
const postAuthorizationProjectId = document.querySelector("#post-authorizations-projectId");


/*
    OUTPUT
*/
const postAuthorizationsText = document.querySelector("#post-authorizations-status");

/*
    FUNCTIONS
*/
async function postAuthorization(event) {
    event.preventDefault();

    const user = postAuthorizationUserId.value.trim();
    const project = postAuthorizationProjectId.value.trim();

    if (!user || !project) {
        postAuthorizationsText.textContent = `Invalid User Submitted`;
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/authorizations`, {
            method: "POST",
            headers: authHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ userId: user, projectId: project })
        })
        

        if (response.status === 400) {
            postAuthorizationsText.textContent = `Server Rejected Data: Bad Request`;
        } else if (!response.ok) {
            throw new Error(`POST /authorizations failed with status ${response.status}`);
        } else {
            const data = await response.json();
            const authorization = data.authorization;
            console.log(authorization);
            postAuthorizationsText.textContent = `Non-Owner User ${authorization.userId} can access Project ${authorization.projectId}`;
        }

    } catch (error) {
        postAuthorizationsText.textContent = `Error Creating Authorization: ${error.message}`;
    }


}
postAuthorizationForm.addEventListener("submit", async (event) => { postAuthorization(event) });