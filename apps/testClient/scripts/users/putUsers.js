import { API_BASE_URL, authHeaders } from "./../env.js";

/* 
    INPUT
*/
const putUserForm = document.querySelector("#put-user-form");
const putUserId = document.querySelector("#put-user-id");
const putUserName = document.querySelector("#put-user-name");
const putUserEmail = document.querySelector("#put-user-email");
const putUserRole = document.querySelector("#put-user-role");
const putUserPassword = document.querySelector("#put-user-password");

/*
    OUTPUT
*/
const putUserText = document.querySelector("#put-user-status");

/*
    FUNCTIONS
*/
async function putUsers(event) {
    event.preventDefault();

    const id = putUserId.value;
    const name = putUserName.value.trim();
    const email = putUserEmail.value.trim();
    const role = putUserRole.value.trim();
    const password = putUserPassword.value.trim();

    if (!name) {
        putUserText.textContent = `Invalid User Submitted`;
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: "PUT",
            headers: authHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ username: name, email: email, role: role, password: password })
        })

        if (response.status === 400) {
            putUserText.textContent = `Server Rejected Data: Bad Request`;
        } else if (!response.ok) {
            throw new Error(`PUT /users/${id} failed with status ${response.status}`);
        } else {
            const data = await response.json();
            const user = data.user;
            console.log(user);
            putUserText.textContent = `Updated or made user => ${user.id}. ${user.username} ${user.email} ${user.role} (${user.createdAt}/${user.updatedAt})`;
        }

    } catch (error) {
        putUserText.textContent = `Error Updating or Creating User: ${error.message}`;
    }


}
putUserForm.addEventListener("submit", async (event) => { putUsers(event) });