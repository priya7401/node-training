# Hello World project - Node training

.env file contents:

PORT=\
POSTGRES_HOST=\
POSTGRES_PORT=\
POSTGRES_USERNAME=\
POSTGRES_PASSWORD=\
POSTGRES_DATABASE=\
SALT_ROUNDS=\
JWT_TOKEN_KEY=

### Commands
1. to start the server, run the following command:  ```npm run nodemon-dev```
2. Postgres db migration generate command, to generate new migration: ```migration_name=<migrationName> npm run migrate:generate```
3. run the migration: ```npm run migrate:run```