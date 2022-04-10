require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let supertokens = require("supertokens-node");
let Session = require("supertokens-node/recipe/session");
let EmailPassword = require("supertokens-node/recipe/emailpassword");
let { middleware } = require("supertokens-node/framework/express");
let cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const Users = require('./models/users');

var app = express();

supertokens.init({
    framework: "express",
    supertokens: {
        // try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
        connectionURI: "http://localhost:3002",
        // apiKey: "IF YOU HAVE AN API KEY FOR THE CORE, ADD IT HERE",
    },
    appInfo: {
        // learn more about this on https://supertokens.com/docs/session/appinfo
        appName: "parentalogi-api",
        apiDomain: "http://localhost:3001",
        websiteDomain: "http://localhost:3000",
        apiBasePath: "/",
        websiteBasePath: "/",
    },
    recipeList: [
        EmailPassword.init({
          signUpFeature: {
            formFields: [
              {
                id: "nama_pengguna"
              },
              {
                id: "nama"
              }
            ]
          },
          override: {                
            apis: (originalImplementation) => {                    
              return {                                                
                ...originalImplementation,
                signUpPOST: async function (input) {
                  if (originalImplementation.signUpPOST === undefined) {                                
                    throw Error("Should never come here");                            
                  }
                  // First we call the original implementation of signUpPOST.                            
                  let response = await originalImplementation.signUpPOST(input);

                  // Post sign up response, we check if it was successful                            
                  if (response.status === "OK") {                                
                    // // These are the input form fields values that the user used while signing up                                
                    let formFields = input.formFields;                                
                    // TODO: post sign up logic
                    Users.update(
                      {
                        nama_pengguna : formFields.filter((f) => f.id === "nama_pengguna")[0].value, 
                        nama : formFields.filter((f) => f.id === "nama")[0].value
                      },
                      {
                        where : {
                          email : formFields.filter((f) => f.id === "email")[0].value
                        }
                      }
                    )
                  }                               
                  return response;                        
                },
                signInPOST: async function (input) {
                  if (originalImplementation.signInPOST === undefined) {                                
                    throw Error("Should never come here");                            
                  }
                  // First we call the original implementation of signInPOST.                            
                  let response = await originalImplementation.signInPOST(input);

                  // Post sign up response, we check if it was successful                            
                  if (response.status === "OK") {                                
                    let { id, email } = response.user;
                    // These are the input form fields values that the user used while signing in                                
                    let formFields = input.formFields                                
                    // TODO: post sign in logic                            
                  }                            
                  return response;                        
                }                    
              }                
            }            
          }        
        }), // initializes signin / sign up features
        Session.init({

        }) // initializes session features
    ]
});

app.use(
 cors({
   origin: "http://localhost:3001",
   allowedHeaders: [
    "content-type",
    supertokens.getAllCORSHeaders()],
   credentials: true,
 })
);

app.use(middleware());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
