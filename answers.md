# Reflection Questions

## What is the difference between authentication and authorization?
Authentication proves who the user is. It allows the server to 'know'
who is accessing it even if they are on a different machine than
normal and across sessions.

Authorization uses the authentication to ensure that the user has the
privileges to access the requested data or perform the specified 
function.

## Why should passwords be hashed instead of stored directly?
Passwords should be hashed in case the database leaks. If a bad actor get ahold
of the hashes, it doesn't tell them anything unless they are capable of reversing
the function used to generate the hash, a notoriously difficult feat.

## What information did you include in your JWT, and why?
To be honest, I just used the one from the example. However, if I
were a bit more selective, the only thing I could leave off is the
username. The id and role are both used to determine privileges. The
role is used for coarse-grain privileges and the id is used for 
fine-grain privileges.

## What is the difference between a 401 response and a 403 response?
A 401 should be returned when a route requires an authenticated user.
That is to say, a user must be 'logged in' to call this route. A 403
means that a user is 'logged in' but does not have the priviledges to
execute the requested route.

## Where does your application perform role or ownership checks?
I tried to use the middleware where at all possible but as you will 
read in my reflections, I screwed up in a previous architectural/design
phase. Since I decided to keep the milestone 4 design choices and keep 
moving on, I ended up having to implement it directly into the routes.
In `roleValidation.ts`, there are some methods that are commonly used
to determine ownership. Both self-identity and local role checks are
done locally since they are only 1-liners.

This is not optimal and a better design would allow me to more easily
check the 'roles' and 'pseudo-roles' (owner, member) through the
middleware. To do this, one would need a function to relate columns
to specific roles and that perform authorization checks.

## How are users, projects, and tasks related in your database?
There are 4 roles/psuedo-roles:
- admin: can do pretty much anything, see `README.md` for more
- user-owner: has access to most project level routes for their projects
- user-member: has access to task level routes for projects they are members of
- user-non-member: can view orphaned tasks, can create projects (becoming the owner), can change information about self

Any role contains the the lower level privileges as well.

Relationships:
- Owners own projects
- Projects have members
- Projects have tasks (which can be assigned to users)

## What was the hardest part of adding authentication or authorization?
I think I tried to go a bit too far for the mistakes I made prior, so
a lot of the routes are dissimilar. This means each implementation is
custom to the route. This is pretty bad for maintainability unfortunately
and I would do it very different if I were to do it again. The main
thing that tripped me up was creating a simple Users and Projects table,
adding all the routes that Tasks had to them, and then adding all the 
fields in the assignment description without thinking how it'd impact
milestone 5 & 6.