import { API_BASE_URL, authHeaders } from "./../env.js";

/* 
    INPUT
*/
const getUsersButton = document.querySelector("#get-users");

/*
    OUTPUT
*/
const getUsersList = document.querySelector("#users");

/*
    FUNCTIONS
*/
async function getUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`, { headers: authHeaders() });

        if (!response.ok) {
            throw new Error(`GET /users failed with status ${response.status}`);
        }

        const data = await response.json();

        getUsersList.replaceChildren();
        for (const user of data.users) {
            const li = document.createElement("li");
            li.textContent = `${user.id}. ${user.username} ${user.email} ${user.role} (${user.createdAt}/${user.updatedAt})`;
            getUsersList.appendChild(li);
        }

    } catch (error) {
        getUsersList.replaceChildren();
        const li = document.createElement("li");
        li.textContent = `Error Retrieving Users: ${error.message}`
        getUsersList.appendChild(li);
    }
}
getUsersButton.addEventListener("click", getUsers);
