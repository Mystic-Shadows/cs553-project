import { API_BASE_URL, authHeaders } from "./../env.js";

/* 
    INPUT
*/
const postUserForm = document.querySelector("#post-user-form");
const postUserName = document.querySelector("#post-user-name");
const postUserEmail = document.querySelector("#post-user-email");
const postUserRole = document.querySelector("#post-user-role");
const postUserPassword = document.querySelector("#post-user-password");


/*
    OUTPUT
*/
const postUserText = document.querySelector("#post-user-status");

/*
    FUNCTIONS
*/
async function postUser(event) {
    event.preventDefault();

    const name = postUserName.value.trim();
    const email = postUserEmail.value.trim();
    const role = postUserRole.value.trim();
    const password = postUserPassword.value.trim();

    if (!name) {
        postUserText.textContent = `Invalid User Submitted`;
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: "POST",
            headers: authHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ username: name, email: email, role: role, password: password })
        })

        if (response.status === 400) {
            postUserText.textContent = `Server Rejected Data: Bad Request`;
        } else if (!response.ok) {
            throw new Error(`POST /users failed with status ${response.status}`);
        } else {
            const data = await response.json();
            const user = data.user;
            console.log(user);
            postUserText.textContent = `Made the following user => ${user.id}. ${user.username} ${user.email} ${user.role} (${user.createdAt}/${user.updatedAt})`;
        }

    } catch (error) {
        postUserText.textContent = `Error Creating User: ${error.message}`;
    }


}
postUserForm.addEventListener("submit", async (event) => { postUser(event) });