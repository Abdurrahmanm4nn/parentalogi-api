## How to Run Locally :
- Clone from this repo
- Create .env file (define variable APP_NAME, PORT (assign to 3001), NODE_ENV, DB_USERNAME, DB_PASSWORD, DB_HOSTNAME, DB_NAME, and DB_DIALECT) (if never done before)
- Create db locally (also if never done before)
- Run command "npm install"
- Follow instructions here https://supertokens.com/docs/emailpassword/quick-setup/core/without-docker to create core for supertokens locally, and create file config.yaml (set core_config_version: 0, and define variable port, mysql_user mysql_password, mysql_host, mysql_port, and mysql_database_name according to .env file) (again, if never done before)
- (from cloned directory, do 2 things below)
- Run command "supertokens start --with-config=config.yaml"
- Run command "npx sequelize-cli db:migrate" (once again, if never done before)
- Run command "npm start"

### If still confused, chat me!!!