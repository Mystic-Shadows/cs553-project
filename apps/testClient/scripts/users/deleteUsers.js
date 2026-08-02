import { API_BASE_URL, authHeaders } from "./../env.js";

/* 
    INPUT
*/
const deleteUserForm = document.querySelector("#delete-user-form");
const deleteUserId = document.querySelector("#delete-user-id");

/*
    OUTPUT
*/
const deleteUserText = document.querySelector("#delete-user-status");

/*
    FUNCTIONS
*/
async function deleteUser(event) {
    event.preventDefault();

    const id = Number(deleteUserId.value);

    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, { headers: authHeaders(), method: "DELETE" });
        if (response.status === 404) {
            deleteUserText.textContent = `User ${id} not found`;
        } else if (!response.ok) {
            throw new Error(`DELETE /api/users/${id} failed with status ${response.status}`);
        } else {
            deleteUserText.textContent = `Successfully deleted user ${id}`;
        }

    } catch (error) {
        deleteUserText.textContent = `Error Deleting User ${id}: ${error.message}`;
    }

}
deleteUserForm.addEventListener("submit", async (event) => { deleteUser(event) });
