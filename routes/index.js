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
  let session = req.session;
  // get the user's Id from the session
  let userId = session.getUserId();
  res.cookie('user_id', userId);
});
router.get('/posts', async function(req, res, next) {
  let data;

  data = await Posts.scope('toView').findAll({
    order: [['id', 'DESC']]
  });

  return res.status(200).json(data);
});
router.get('/posts/:filterName/:filterValue', async function(req, res, next) {
  let data;
  
  let filterName = req.params.filterName;
  let filterValue = req.params.filterValue;

  if(filterName == "id"){
     data = await Posts.scope('toView').findAll({
      where: {
       id: filterValue
      }
    });
  }

  return res.status(200).json(data);
});
router.post("/create-posts", (req=SessionRequest, res) => {
  let cookies = req.cookies;

  //verifySession()
  if (cookies === undefined){
    return res.status(401).send("Please login first!");
  }

  let postTitle = req.body.judul;
  let slug = req.body.slug;
  let postContent = req.body.isi_text;
  let userId = cookies.user_id;

  try{
    Posts.create({
      id_penulis: userId,
      slug: slug,
      judul: postTitle,
      isi_text: postContent,
      updatedAt: sequelize.NOW
    });
  }catch(e){
    return res.status(500).send(e);
  }
  
  return res.status(200).send("Successfully Creating a Post!");
});
router.post("/refresh", async (req= SessionRequest, res) => {
  let sess = Session.createNewSession(res, req.cookies.user_id);

  return res.status(200).send("Successfully Creating your session!");
});
// Add this AFTER all your routes
app.use(errorHandler());

module.exports = router;
