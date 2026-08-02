import { API_BASE_URL, authHeaders } from "./../env.js";

/* 
    INPUT
*/
// Get Task
const getUserForm = document.querySelector("#get-user-form");
const getUserId = document.querySelector("#get-user-id");

/*
    OUTPUT
*/
const getUserText = document.querySelector("#user");


/*
    FUNCTIONS
*/
async function getUser(event) {
    event.preventDefault();

    const id = getUserId.value;

    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, { headers: authHeaders() });
        if (response.status === 404) {
            getUserText.textContent = `User ${id} not found`;
        } else if (!response.ok) {
            throw new Error(`GET /users/:id failed with status ${response.status}`);
        } else {
            const user = await response.json();
            getUserText.textContent = `${user.id}. ${user.username} ${user.email} ${user.role} (${user.createdAt}/${user.updatedAt})`;
        }

    } catch (error) {
        getUserText.textContent = `Error Retrieving User ${id}: ${error.message}`;
    }

}
getUserForm.addEventListener("submit", async (event) => { getUser(event) });