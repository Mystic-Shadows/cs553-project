# Reflection

## What is the difference between an in-memory API and a database-backed API?
Persistence is the primary functional difference. In-house solutions are 
possible to do the same thing, but they are more likely to have bugs or
performance issues.

## Why is it useful to separate routes, services, and database logic?
It makes the code easier to navigate and read. Furthermore, since 
Express functions are order dependent (the order of attachment matters),
it makes it easier to modify the order when needed since the developer
does not need to move blocks of code.

## What HTTP status codes did you use, and why?
I used:
- 200: for successful actions not resulting in a new task or the deletion of a task
- 201: for successfully creating a new task
- 204: for successfully deleting a task
- 400: for invalid IDs
- 400: for invalid Titles
- 404: for methods with valid IDs that don't have a corresponding task in the database
- 404: for attempting a route that doesn't exist
- 500: for database errors

## What happens when a client requests a task ID that does not exist?
Depends. If `id` < 1 OR `id` > NEXT SERIAL KEY, then a `400` is returned.
Otherwise, if the id is valid and the task doesn't exist, a `404` is 
returned. Notably, if a `404` is returned, a `put` can make a new task 
there.

## What was the hardest part of connecting the API to PostgreSQL?
I had to switch the image to `postgres:16-alpine` from `postgres:16`
for the DB to run on my Windows machine. I still don't know exactly
why and I hope it doesn't cause future issues... Otherwise, I've had
some experience with a couple types of SQL DBs in the workforce, so
I am familiar with the basics.
