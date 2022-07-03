# My Delay Repay

## Description

this is a full-stack app for submitting and processing train delay compensation claims from consumers.

the full-stack functionality is complete for:
- registration/authentication
- updating User details
- user refund dashboard
- posting new claims
- hubspot crm integration for new users & new claims
- full offline mode for submitting claims in poor or no connectivity environments
- payment integration (stripe)

## Technologies used

- typeScript (front & backend)
- node w/ nest.js
- angular w/ ionic
- hubspot api
- stripe api
- firebase 
- national rail hsp api
- passport.js
- tailwind
- prisma
- nx

## How to setup

- create a .env file using the .env.exmaple file and add in all the variables
- add the variables to /apps/mdr/mob/src/environments
- use the useful commands below to start the project

# Useful project commands
```
# general
nx serve {APP_NAME} // serve an app
nx generate @nrwl/angular:app {NAME} --backendProject {NAME} --addTailwind=true --skipTests=true // generate a new angular project, with a proxy setup for connecting to a backend project, and tailwind already set up, without any test files
nx g @nrwl/workspace:lib {LIB_NAME} // create new shared library
nx g @nrwl/nest:application {API_NAME} // creates a  new nest api project
nx run-many --target=build --projects={NAME},{NAME} // build multiple projects at once
nx run-many --target=serve --projects={NAME},{NAME} // serve multiple projects at once
nx affected:apps // see all apps effected by all the uncommited changes made to a lib
nx affected:test -- --only-failed // run tests on all apps that are effected by the current uncommitted changes made to a lib

# angular
nx g @nrwl/angular:component {PATH}{NAME} --project={NAME} --flat={BOOL} --style=none --skipTests=true --prefix=app // generate angular component
nx run mdr.mob:build-prod-watch // builds new prod builds to dist on any changes. use alongside serve-prod-watch for prod build reloads
nx run mdr.mob:serve-prod-watch // serves the current prod build in the /dist directory

# tailwind
{APP_NAME} // add tailwind to a new angular project:

# storybook
nx storybook {APP_NAME} // serve storybook
nx g @nrwl/angular:storybook-configuration {PROJECT_NAME} // add storybook to a project
nx g @nrwl/angular:stories {PROJECT_NAME} // add stories.ts files to all components in a project

# nest
nx g @nrwl/nest:controller {PATH}{NAME} --project={NAME} --flat={BOOL} --language=ts --skipTests=true
nx g @nrwl/nest:service {PATH}{NAME} --project={NAME} --flat={BOOL} --language=ts

# ionic
nx generate @nxtend/ionic-angular:app {NAME} // generate a new ionic-angular app
nx build {APP_NAME}
nx run {APP_NAME}:add:{ios|android}
nx run {APP_NAME}:open:{ios|android} // open in android studios or XCode
nx run {APP_NAME}:sync   

# material design
npx nx g @angular/material:ng-add --project={NAME} //adds material design 

# prisma
nx run prisma-clients:reset --client={CLIENT_DIR}
nx run prisma-clients:re-seed --client={CLIENT_DIR}
nx run prisma-clients:db-push --client={CLIENT_DIR}
nx run prisma-clients:generate --client={CLIENT_DIR}
```

## Start front or backend apps in HTTP or HTTPS
For the angular mobile app:
```
nx serve {APP_NAME} --prod // for HTTPS
nx serve {APP_NAME} // for HTTP
```
For the nest app:
In your .env file, change "USE_SSL" to "true" for HTTPS, or "false" for HTTP

## Generate a new prisma library
this workspace has a custom generator for building prisma library projects with a unique client, database endpoint, and preconfigured exports.
1. to generate a new prisma project, run:
```shell
nx workspace-generator prisma-generator # 
# then run
prisma db push --schema="./libs/prisma-clients/${CLIENT_NAME}/prisma/schema.prisma"
prisma generate --schema="./libs/prisma-clients/${CLIENT_NAME}/prisma/schema.prisma"
```
2. import the new library into any project
```ts
import { ${LIBRARY_NAME}Client } from '@nx-prisma/prisma-clients'
import { ExampleModel } from '@nx-prisma/prisma-clients/{LIBRARY_NAME}'
```

## Run prisma seeder
```
nx run prisma-clients:seed --client=main //TODO: This command currently isn't working :(
```

# How to Install & Configure Postgres

- download & install https://postgresapp.com/
- start a postgres server in the app & in the shell run:
```
CREATE DATABASE multi;
\c multi
CREATE SCHEMA multischema  
ALTER USER postgres WITH PASSWORD 'thisisatest';
```

# How to Set up HTTPS
https://dev.to/nightbr/full-https-ssl-development-environment-4dam


# How to Test Mobile App With Service Worker from dist/ 

Testing the service worker requires serving the app from the dist/ folder over HTTPS. To do this:

1. In your terminal, run `nx run mdr.mob:build-prod-dist`

2. In another terminal, run `nx run mdr.mob:serve-prod-dist`. NOTE: If you make changes to the project, you will have to run this command again for the changes to take effect.

2. In .env, set "USE_SSL" to true and then in a third terminal, run `nx serve mdr.api`

3. Start Chrome with CORS disabled:
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security -–allow-file-access-from-files --user-data-dir="/Users/drakemacbook2/Library/ApplicationSupport/Google/Chrome" --disable-site-isolation-trials
