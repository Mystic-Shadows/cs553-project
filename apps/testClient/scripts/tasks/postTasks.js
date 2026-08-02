import { API_BASE_URL, authHeaders } from "./../env.js";

/* 
    INPUT
*/
const postTaskForm = document.querySelector("#post-task-form");
const postTaskTitle = document.querySelector("#post-task-title");
const postTaskDescription = document.querySelector("#post-task-description");
const postTaskStatus = document.querySelector("#post-task-status");
const postTaskAssignee = document.querySelector("#post-task-assignee");
const postTaskProject = document.querySelector("#post-task-project");

/*
    OUTPUT
*/
const postTaskText = document.querySelector("#post-status");

/*
    FUNCTIONS
*/
async function postTask(event) {
    event.preventDefault();

    const title = postTaskTitle.value.trim();
    const description = postTaskDescription.value.trim();
    const status = postTaskStatus.value.trim();
    const assignee = postTaskAssignee.value;
    const project = postTaskProject.value;

    if (!title) {
        postTaskText.textContent = `Invalid Task Submitted`;
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: "POST",
            headers: authHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ title, description, status, assignee, project })
        })

        if (response.status === 400) {
            postTaskText.textContent = `Server Rejected Data: Bad Request`;
        } else if (!response.ok) {
            throw new Error(`POST /tasks failed with status ${response.status}`);
        } else {
            const data = await response.json();
            const task = data.task;
            console.log(task);
            postTaskText.textContent = `Made the following task => ${task.id}. ${task.project}/${task.title}: [${task.status}] {${task.assignee}} ${task.description} (${task.createdAt}/${task.updatedAt})`;
        }

    } catch (error) {
        postTaskText.textContent = `Error Creating Task: ${error.message}`;
    }


}
postTaskForm.addEventListener("submit", async (event) => { postTask(event) });