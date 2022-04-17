var express = require('express');
var router = express.Router();
var EmailPassword = require('supertokens-node/recipe/emailpassword');
let { errorHandler, middleware, SessionRequest } = require("supertokens-node/framework/express");
let { verifySession } = require("supertokens-node/recipe/session/framework/express");
const Posts = require('./../models/Posts');
let app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post("/create-posts", verifySession(), (req=SessionRequest, res) => {
  let session = req.session;
  let postTitle = req.body.judul;
  let postContent = req.body.isi_text;
  let userEmail = session.getUserByEmail();

  Posts.create({
    id_penulis: userEmail,
    judul: postTitle,
    isi_text: postContent
  });
});
router.post("/refresh", verifySession({sessionRequired: false}), async (req= SessionRequest, res) => {
    let userId = req.session.getUserId();
    let role = "admin"; // TODO: fetch based on user

    // Note that this will override any existing access token payload    
    // that you may have provided earlier.    
    await req.session.updateAccessTokenPayload(        
      { 
        role 
      }    
    );
    //....
});
// Add this AFTER all your routes
app.use(errorHandler());

module.exports = router;
