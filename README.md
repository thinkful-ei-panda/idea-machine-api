ID8 by Wesley Rou
=================

Live App: https://idea-machine.vercel.app/
Client Repo: https://github.com/thinkful-ei-panda/idea-machine-client

API Endpoints:
--------------

### Users Endpoints

POST /api/users
Creates an account

### Auth Endpoints

POST /api/auth/login
Logs in to an existing account

### Ideas Endpoints

GET /api/ideas
Gets all public ideas

POST /api/ideas
Posts a new idea

GET /ideas/idea/:id

PATCH /ideas/idea/:id
Updates an existing idea

DELETE /ideas/idea/:id
Deletes an existing idea

GET /ideas/my-ideas
Gets all ideas authored by the logged in user

### Followed Ideas Endpoints

GET /api/followedIdeas
Gets all ideas followed by logged in user

POST /api/followedIdeas
Follows an idea

GET /api/followedIdeas/:id

DELETE /api/followedIdeas/:id
Unfollows an idea

## Technology

Made with the Express framework. Uses postgrator to perform table migrations to SQL database and knex library to write make changes to the tables.