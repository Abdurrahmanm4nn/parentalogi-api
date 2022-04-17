require('dotenv').config();

const {
  NODE_ENV,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOSTNAME,
  DB_NAME,
  DB_DIALECT,
  DB_URI,
  EMAIL_USER,
  EMAIL_PASS,
  API_DOMAIN,
  WEB_DOMAIN,
  ST_URI
} = process.env;

module.exports = {
  "development": {
    "username": DB_USERNAME,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "host": DB_HOSTNAME,
    "dialect": DB_DIALECT,
    "db_uri": DB_URI,
    "email_user": EMAIL_USER,
    "email_pass": EMAIL_PASS,
    "api_domain": API_DOMAIN,
    "web_domain": WEB_DOMAIN,
    "supertokens_uri": ST_URI
  },
  "test": {
    "username": DB_USERNAME,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "host": DB_HOSTNAME,
    "dialect": DB_DIALECT,
    "email_user": EMAIL_USER,
    "email_pass": EMAIL_PASS,
    "api_domain": API_DOMAIN,
    "web_domain": WEB_DOMAIN,
    "supertokens_uri": ST_URI
  },
  "production": {
    "username": DB_USERNAME,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "host": DB_HOSTNAME,
    "dialect": DB_DIALECT,
    "email_user": EMAIL_USER,
    "email_pass": EMAIL_PASS,
    "api_domain": API_DOMAIN,
    "web_domain": WEB_DOMAIN,
    "supertokens_uri": ST_URI
  }
}
