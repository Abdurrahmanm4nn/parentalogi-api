var express = require('express');
var router = express.Router();
var EmailPassword = require('supertokens-node/recipe/emailpassword');
let { errorHandler, middleware, SessionRequest } = require("supertokens-node/framework/express");
let { verifySession } = require("supertokens-node/recipe/session/framework/express");
let Session = require('supertokens-node/recipe/session');
const Posts = require('./../models/posts');
const sequelize = require('sequelize');
let app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post("/create-posts", (req=SessionRequest, res) => {
  let session = req.cookies;
  let postTitle = req.body.judul;
  let postContent = req.body.isi_text;
  let userId = session.user_id;

  Posts.create({
    id_penulis: userId,
    judul: postTitle,
    isi_text: postContent,
    updatedAt: sequelize.NOW
  });
});
router.post("/refresh", verifySession({sessionRequired: false}), async (req= SessionRequest, res) => {
  Session.refreshSession(req, res);
});
// Add this AFTER all your routes
app.use(errorHandler());

module.exports = router;
