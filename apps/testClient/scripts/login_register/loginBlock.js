import { API_BASE_URL, setAccessToken } from "./../env.js";

/* 
    INPUT
*/
const loginForm = document.querySelector("#login-form");
const usernameField = document.querySelector("#login-username");
const passwordField = document.querySelector("#login-password");

/*
    OUTPUT
*/
const loginText = document.querySelector("#login-status");

/*
    FUNCTIONS
*/

async function loginBlock(event) {
    event.preventDefault();

    const username = usernameField.value.trim();
    const password = passwordField.value.trim();

    const clickedButton = event.submitter;

    var response;

    try {
        if (clickedButton.value === "login") {
            if (!username || !password) {
                loginText.textContent = `Invalid name Submitted`;
                return;
            }
            response = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            })

            if (response.status === 400) {
                loginText.textContent = `Server Rejected Login: Bad Request`;
            } else if (response.status === 404) {
                loginText.textContent = `Server Rejected Data: User not Found`;
            } else if (!response.ok) {
                throw new Error(`login failed with status ${response.status}`);
            } else {
                const data = await response.json();
                setAccessToken(data.accessToken);
                loginText.textContent = `Login Successful as ${data.user.username} (ID: ${data.user.id})`;
            }


        }
        else if (clickedButton.value === "register") {
            if (!username || !password) {
                loginText.textContent = `Invalid name Submitted`;
                return;
            }
            response = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            })

            if (response.status === 400) {
                loginText.textContent = `Server Rejected Register: Bad Request`;
            } else if (!response.ok) {
                throw new Error(`registration failed with status ${response.status}`);
            } else {
                loginText.textContent = `Registration Successful`;
            }
        }
    } catch (error) {
        loginText.textContent = `Error in an auth process: ` + error;
    }

}

loginForm.addEventListener("submit", async (event) => { loginBlock(event) });