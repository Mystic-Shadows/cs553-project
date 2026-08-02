import { API_BASE_URL, authHeaders } from "./../env.js";

/* 
    INPUT
*/
const patchUserForm = document.querySelector("#patch-user-form");
const patchUserId = document.querySelector("#patch-user-id");
const patchUserName = document.querySelector("#patch-user-name");
const patchUserEmail = document.querySelector("#patch-user-email");
const patchUserRole = document.querySelector("#patch-user-role");
const patchUserPassword = document.querySelector("#patch-user-password");

/*
    OUTPUT
*/
const patchUserText = document.querySelector("#patch-user-status");

/*
    FUNCTIONS
*/

async function patchUser(event) {
    event.preventDefault();

    const id = Number(patchUserId.value);
    const name = patchUserName.value.trim();
    const email = patchUserEmail.value.trim();
    const role = patchUserRole.value.trim();
    const password = patchUserPassword.value.trim();

    const clickedButton = event.submitter;

    var response;

    try {
        if (clickedButton.value === "name") {
            if (!name) {
                patchUserText.textContent = `Invalid name Submitted`;
                return;
            }
            response = await fetch(`${API_BASE_URL}/users/${id}`, {
                method: "PATCH",
                headers: authHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify({ username: name })
            })
        }
        else if (clickedButton.value === "email") {
            response = await fetch(`${API_BASE_URL}/users/${id}`, {
                method: "PATCH",
                headers: authHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify({ email })
            })
        }
        else if (clickedButton.value === "role") {
            response = await fetch(`${API_BASE_URL}/users/${id}`, {
                method: "PATCH",
                headers: authHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify({ role })
            })
        }
        else if (clickedButton.value === "password") {
            response = await fetch(`${API_BASE_URL}/users/${id}`, {
                method: "PATCH",
                headers: authHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify({ password })
            })
        }

        if (response.status === 400) {
            patchUserText.textContent = `Server Rejected Data: Bad Request`;
        } else if (response.status === 404) {
            patchUserText.textContent = `Server Rejected Data: Original Item not Found`;
        } else if (!response.ok) {
            throw new Error(`PUT /api/users/${id} failed with status ${response.status}`);
        } else {
            const data = await response.json();
            const user = data.user;
            patchUserText.textContent = `Updated the user => ${user.id}. ${user.username} ${user.email} ${user.role} (${user.createdAt}/${user.updatedAt})`;
        }

    } catch (error) {
        patchUserText.textContent = `Error Editing User ${id}: ${error.message}`;
    }

}
patchUserForm.addEventListener("submit", async (event) => { patchUser(event) });