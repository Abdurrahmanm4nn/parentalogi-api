var express = require('express');
var router = express.Router();
var EmailPassword = require('supertokens-node/recipe/emailpassword');
let {errorHandler} = require("supertokens-node/framework/express");
let { middleware } = require("supertokens-node/framework/express");
let app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post("/refresh", middleware(), (req, res) => {
    res.send('refreshing token');
});
router.post("/forget-password", async (req, res) => {     
    let updatedPassword = req.body.newPassword
      // get the user's Id from the session    
    let userEmail = req.body.email
      // get the signed in user's email from the getUserById function    
    let userInfo = await EmailPassword.getUserByEmail(userEmail)
    let userId = userInfo.id
    if (userInfo === undefined) {        
      throw new Error("Should never come here")    
    }
    // update the user's password using updateEmailOrPassword    
    let response = await EmailPassword.updateEmailOrPassword({        
      userId,        
      password: updatedPassword    
    });

    if (!response){
      return res.status(500);
    }
    return res.status(200).json({"message" : "Successfully Changing password!"})
  }
);
// Add this AFTER all your routes
app.use(errorHandler());

module.exports = router;
