import { API_BASE_URL, authHeaders } from "./../env.js";

/* 
    INPUT
*/
const getDatabaseHealthButton = document.querySelector("#get-database-health");

/*
    OUTPUT
*/
const databaseHealthText = document.querySelector("#database-health");

/*
    FUNCTIONS
*/
async function getDatabaseHealth() {
    try {
        databaseHealthText.textContent = `Getting Status`;
        const response = await fetch(`${API_BASE_URL}/db-health`, {headers: authHeaders()});

        if (!response.ok) {
            throw new Error(`GET /api/db-health failed with status ${response.status}`);
        }

        databaseHealthText.textContent = `DB is up`;

    } catch (error) {
        console.error("Issue getting DB Health:", error);
        databaseHealthText.textContent = `Issue getting DB Health:, ${error}`;
    }
}
getDatabaseHealthButton.addEventListener("click", getDatabaseHealth);
