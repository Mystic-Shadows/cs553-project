# Test Plan
```
At minimum, verify:
[TC1] A user can register.
[TC1] A registered user can log in.
[TC1] Login returns a JWT.
[TC2] Incorrect login credentials are rejected.
[TC2] A protected route rejects a request without a token.
[TC1] A protected route accepts a valid token.
[TC3] A normal user cannot access an administrator-only operation.
[TC1] An administrator can access the administrator-only operation.
[TC1] A project can be created by an authenticated user.
[TC1] A task can be associated with a project.
[TC1] A user cannot modify a resource they do not own or control.
[TC2, TC3] The API returns appropriate 401, 403, and 404 responses.
```

Can also test other off-nominals as going along...

## TC1: Nominal Project Test Case
1. register the following users:
    - owner
    - member
    - user
1. Log into the owner account
1. Make projects `a`, `b`, and `c`
1. Authorize `member` to access project `a`
1. add a task to project `c`
1. delete project `c`
1. login as member
1. add a task to project `a`
1. edit the task to add self as the assignee
1. delete self
1. login as user
1. attempt to modify the description of project `a`
1. login as admin
1. view all tasks
1. view all users

## TC2: Bad Login
1. attempt bad login to admin
1. attempt to get db health

## TC3: User attempts Admin Functions
1. register a user named user (if not already made)
1. login as user
1. attempt to view all users
1. attempt to view project 100