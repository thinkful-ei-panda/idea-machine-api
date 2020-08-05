ID8 by Wesley Rou
=================

Live App: https://idea-machine.vercel.app/

API Endpoints:
--------------

Auth Endpoints
--------------

POST /api/auth/login

Followed Ideas Endpoints
------------------------

GET /api/followedIdeas

POST /api/followedIdeas

GET /api/followedIdeas/:id

DELETE /api/followedIdeas/:id

Ideas Endpoints
---------------

GET /api/ideas

POST /api/ideas

GET /ideas/idea/:id

PATCH /ideas/idea/:id

DELETE /ideas/idea/:id

GET /ideas/my-ideas

Users Endpoints
---------------

POST /api/users












## Set up

Install dependencies `npm start`

Set up database and tables



## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.