import { API_BASE_URL, authHeaders } from "./../env.js";

/* 
    INPUT
*/
const deleteUserForm = document.querySelector("#delete-authorizations-form");
const deleteAuthorizationUser = document.querySelector("#delete-authorizations-userId");
const deleteAuthorizationProject = document.querySelector("#delete-authorizations-projectId");

/*
    OUTPUT
*/
const deleteAuthorizationsText = document.querySelector("#delete-authorizations-status");

/*
    FUNCTIONS
*/
async function deleteUser(event) {
    event.preventDefault();

    const user = Number(deleteAuthorizationUser.value);
    const project = Number(deleteAuthorizationProject.value);

    try {
        const response = await fetch(`${API_BASE_URL}/authorizations?userId=${user}&projectId=${project}`, { headers: authHeaders(), method: "DELETE" });
        if (response.status === 404) {
            deleteAuthorizationsText.textContent = `Authorization ${user}:${project} not found`;
        } else if (!response.ok) {
            throw new Error(`DELETE /api/authorizations?userId=${user}&projectId=${project} failed with status ${response.status}`);
        } else {
            deleteAuthorizationsText.textContent = `Successfully deleted authorization ${user}:${project}`;
        }

    } catch (error) {
        deleteAuthorizationsText.textContent = `Error Deleting Authorization ${user}: ${error.message}`;
    }

}
deleteUserForm.addEventListener("submit", async (event) => { deleteUser(event) });
