# CS 553 Project

## Quickstart
1. Run `npm install` at the following locations:
	- `cs553-project/`
	- `cs553-project/apps/`
	- `cs553-project/apps/api`
2. Go back to `cs553-project/` and run `npm run db:start`
3. Next, run `psql postgresql://postgres:postgres@localhost:5432/cs453 -f database/schema.sql`
4. Run the server using `npm run dev`
5. In another terminal, run the test client using Run the server using `npm run client:dev`
6. Connect to the website through a browser at `http://localhost:5173/`

There is a default admin account: username `admin` password `admin`

User accounts are made with just a username and password (login is then necessary).
Upgrade to admin account can be done by an admin patching the user account's role.

See `testplan.md` for manual test instructions

### Notes
- The database is exposed on port `5432`
- The server is exposed on port `3000`

### Other Commands
- Close database: `npm run db:stop`
- Reset database: `npm run db:reset`

### Process Env variables
Sets to a default if not provided
- process.env.PORT
- process.env.DATABASE_URL
- process.env.JWT_SECRET
- process.env.JWT_EXPIRES_IN

## 'At minimum' section
I completed much of routes before the following got posted and then reviewed it a bit late to fix some of it. Deviations are recorded below.

```
At minimum:
*Registration requires an email and password.
**Duplicate email addresses should be rejected.
Login with incorrect credentials should fail.
Project creation requires a name.
***Task creation requires a title and valid project.
Invalid or missing JWTs should return 401.
Authenticated users without permission should receive 403.
Unknown resources should return 404.
Unexpected database or server errors should return 500.
The server should not crash when it receives a bad request.
Use appropriate HTTP status codes and JSON error responses.
Do not return password hashes in API responses.
```
*registration requires a unique username and password (sub out email with username)

**duplicate usernames are rejected (sub out email with username)

***I allowed for tasks to not have a project... This is project 0 in which
everyone is a member. It is like a backlog. Useful if a project gets deleted 
out from underneath a task.

## File Structure
```text
cs553-project
├── apps
│   ├── api
│   │   ├── src
│   │   │   ├── authorizations
│   │   │   │   ├── deleteAuthorizations.ts
│   │   │   │   ├── getAuthorizations.ts
│   │   │   │   └── postAuthorizations.ts
│   │   │   ├── config
│   │   │   │   └── env.ts
│   │   │   ├── db
│   │   │   │   └── pool.ts
│   │   │   ├── health
│   │   │   │   ├── dbHealth.ts
│   │   │   │   └── health.ts
│   │   │   ├── login
│   │   │   │   └── login.ts
│   │   │   ├── middleware
│   │   │   │   ├── authorizationsValidator.ts
│   │   │   │   ├── projectsLogger.ts
│   │   │   │   ├── requestLogger.ts
│   │   │   │   ├── roleValidation.ts
│   │   │   │   ├── tasksValidators.ts
│   │   │   │   ├── usersValidators.ts
│   │   │   │   └── validateToken.ts
│   │   │   ├── projects
│   │   │   │   ├── deleteProjects.ts
│   │   │   │   ├── getProject.ts
│   │   │   │   ├── getProjects.ts
│   │   │   │   ├── patchProjects.ts
│   │   │   │   ├── postProjects.ts
│   │   │   │   └── putProjects.ts
│   │   │   ├── register
│   │   │   │   └── register.ts
│   │   │   ├── tasks
│   │   │   │   ├── deleteTasks.ts
│   │   │   │   ├── getTask.ts
│   │   │   │   ├── getTasks.ts
│   │   │   │   ├── patchTasks.ts
│   │   │   │   ├── postTasks.ts
│   │   │   │   └── putTasks.ts
│   │   │   ├── users
│   │   │   │   ├── deleteUsers.ts
│   │   │   │   ├── getUser.ts
│   │   │   │   ├── getUsers.ts
│   │   │   │   ├── patchUsers.ts
│   │   │   │   ├── postUsers.ts
│   │   │   │   └── putUsers.ts
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
├── scripts
│   ├── create-issues.sh
│   ├── finish-issue.sh
│   ├── pull-issue.sh
│   ├── README.md
│   ├── review-pr.sh
│   └── start-issue.sh
├── answers.md
├── IntroForStudent.md
├── lessons-learned.md
├── openapi.yaml
├── README.md
└── testplan.md
```

## See testplan.md for test procedure

## Routes

| Method / Path								| Role								| Notes
| ----------------------------------------- | --------------------------------- | -----
| POST login								| ANY								|
| POST register								| ANY								|
| GET health								| ANY								|
| GET db-health								| admin & user:all					|
| GET users/:id								| admin & user:self					|
| GET users									| admin								|
| POST users								| admin								|
| PUT users/:id								| admin								|
| PATCH users/:id							| admin & user:self					|
| DELETE users/:id							| admin & user:self					|
| GET projects/:id							| admin & user:owner & user:member	|
| GET projects								| admin & user:all*					| *Only returns values where user is a member or owner
| POST projects								| admin & user:all					|
| PUT projects/:id							| admin								|
| PATCH projects/:id						| admin & user:owner				|
| DELETE projects/:id						| admin & user:owner				|
| GET tasks/:id								| admin & user:owner & user:member	|
| GET tasks									| admin & user:all*					| *Only returns values where user is a member or owner of the relevant project
| POST tasks								| admin & user:owner & user:member	|
| PUT tasks/:id								| admin & user:owner & user:member	|
| PATCH tasks/:id							| admin & user:owner & user:member	|
| DELETE tasks/:id							| admin & user:owner & user:member	|
| GET authorizations						| admin & user:all*					| *Only returns values relevant to the user OR to a project they own
| POST authorizations						| admin & user:all*					| *Can only post if owner of the project
| DELETE authorizations?userId&projectId	| admin & user:all*					| *Can only delete if owner of the project
