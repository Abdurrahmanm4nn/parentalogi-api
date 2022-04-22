var express = require("express");
var router = express.Router();
var EmailPassword = require("supertokens-node/recipe/emailpassword");
let supertoken = require("supertokens-node/framework/express");
let {
  verifySession,
} = require("supertokens-node/recipe/session/framework/express");
const Comments = require("./../models/comments");
let app = express();
let req = supertoken.SessionRequest;

/* GET test. */
router.get("/", function (req, res, next) {
  res.send("respond with a stinky strange resource");
});

// Add this AFTER all your routes
app.use(supertoken.errorHandler());

module.exports = router;
