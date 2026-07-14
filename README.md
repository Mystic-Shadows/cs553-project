# CS 553 Project

## Quickstart
1. Run `npm install` at the following locations:
	- `cs553-project/`
	- `cs553-project/apps/`
	- `cs553-project/apps/api`
2. Go back to `cs553-project/` and run `npm run db:start`
3. Next, run `$ psql -h localhost -p 5432 -U postgres -d cs453`
4. Run the server using `npm run dev`
5. In another terminal, run the test client using Run the server using `npm run client:dev`
6. Connect to the website through a browser at `http://localhost:5173/`

### Notes
- The database is exposed on port `5432`
- The server is exposed on port `3000`

### Other Commands
- Close database: `npm run db:stop`
- Reset database: `npm run db:stop`

## File Structure
```text
cs553-project
├── apps
│   ├── api
│   │   ├── src
│   │   │   ├── config
│   │   │   │   └── env.ts
│   │   │   ├── db
│   │   │   │   └── pool.ts
│   │   │   ├── health
│   │   │   │   ├── dbHealth.ts
│   │   │   │   └── health.ts
│   │   │   ├── middleware
│   │   │   │   ├── idValidator.ts
│   │   │   │   ├── requestLogger.ts
│   │   │   │   └── validator.ts
│   │   │   ├── tasks
│   │   │   │   ├── deleteTasks.ts
│   │   │   │   ├── getTask.ts
│   │   │   │   ├── getTasks.ts
│   │   │   │   ├── patchTasks.ts
│   │   │   │   ├── postTasks.ts
│   │   │   │   └── putTasks.ts
│   │   │   └── server.ts
│   │   ├── README.md
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── client
│   │   └── README.md
│   ├── testClient
│   │   ├── scripts
│   │   │   ├── databaseHealth.js
│   │   │   ├── deleteTasks.js
│   │   │   ├── env.js
│   │   │   ├── getTask.js
│   │   │   ├── getTasks.js
│   │   │   ├── health.js
│   │   │   ├── patchTasks.js
│   │   │   ├── postTasks.js
│   │   │   └── putTasks.js
│   │   ├── index.html
│   │   ├── README.md
│   │   └── style.css
│   ├── package-lock.json
│   └── package.json
├── database
│   ├── README.md
│   └── schema.sql
├── docs
│   ├── issues
│   │   ├── 003-milestone-1--basic-task-api.md
│   │   ├── 004-milestone-2--full-task-crud.md
│   │   ├── 005-milestone-3--refactor-api-structure.md
│   │   ├── 006-milestone-4--expand-data-model.md
│   │   ├── 007-milestone-5--authentication.md
│   │   ├── 008-milestone-6--authorization-and-ownership.md
│   │   ├── 009-milestone-7--real-time-updates-with-websockets.md
│   │   ├── 010-milestone-8--graphql-api-extension.md
│   │   ├── 011-instructor-task--create-milestone-rubrics.md
│   │   └── 012-instructor-task--create-student-setup-guide.md
│   ├── architecture.md
│   └── deployment.md
├── scripts
│   ├── create-issues.sh
│   ├── finish-issue.sh
│   ├── pull-issue.sh
│   ├── README.md
│   ├── review-pr.sh
│   └── start-issue.sh
├── AGENTS.md
├── answers.md
├── biome.json
├── DevelopmentToods.md
├── docker-compose.yml
├── IntroForStudent.md
├── openapi.yaml
├── package-lock.json
├── package.json
└── README.md
```
## Example `curl` Commands
### Get Health
`curl http://localhost:3000/health`

### Get Database Health
`curl http://localhost:3000/db-health`

### Get Tasks
`curl http://localhost:3000/tasks`

### Get Tasks/:id
Needs a task to be created first.

`curl http://localhost:3000/tasks/1`

### Post Tasks
`curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title": "lab 6"}'`

### Put Tasks/:id
Needs a task to be created first.

`curl -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d '{"title": "lab 6"}'`

### Patch Tasks/:id
Needs a task to be created first.

`curl -X PATCH http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d '{"title": "lab 6"}'`

### Delete Tasks/:id
Needs a task to be created first.

`curl -X DELETE http://localhost:3000/tasks/1`