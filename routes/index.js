var express = require('express');
var router = express.Router();
var EmailPassword = require('supertokens-node/recipe/emailpassword');
let { errorHandler, middleware, SessionRequest } = require("supertokens-node/framework/express");
let { verifySession } = require("supertokens-node/recipe/session/framework/express");
let Session = require('supertokens-node/recipe/session');
const sequelize = require('sequelize');
let app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  let session = req.session;
  // get the user's Id from the session
  let userId = session.getUserId();
  res.cookie('user_id', userId);
});
router.post("/refresh", verifySession(),async (req= SessionRequest, res) => {
  let sess = Session.createNewSession(res, req.cookies.user_id);

  return res.status(200).send("Successfully Creating your session!");
});
// Add this AFTER all your routes
app.use(errorHandler());

module.exports = router;
