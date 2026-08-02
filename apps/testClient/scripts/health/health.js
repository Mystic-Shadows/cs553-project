import { API_BASE_URL } from "./../env.js";

/* 
    INPUT
*/
const getHealthButton = document.querySelector("#get-health");

/*
    OUTPUT
*/
const healthText = document.querySelector("#health");

/*
    FUNCTIONS
*/
async function getHealth() {
    try {
        healthText.textContent = `Getting Status`;
        const response = await fetch(`${API_BASE_URL}/health`);
        if (!response.ok) {
            throw new Error(`GET /api/health failed with status ${response.status}`);
        }
        healthText.textContent = `API is up`;
    } catch (error) {
        console.error("Issue getting Health:", error);
        healthText.textContent = `API is down`;
    }
}
getHealthButton.addEventListener("click", getHealth);
