var express = require('express');
var router = express.Router();
var EmailPassword = require('supertokens-node/recipe/emailpassword');
let { errorHandler, middleware, SessionRequest } = require("supertokens-node/framework/express");
let { verifySession } = require("supertokens-node/recipe/session/framework/express");
let app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post("/refresh", middleware(), (req, res) => {
  
  res.send('refreshing token');

});
router.post("/change-password", verifySession(), async (SessionRequest, res) => {     
    // get the supertokens session object from the req    
    let session = SessionRequest.session
    // retrive the old password from the request body    
    let oldPassword = SessionRequest.body.oldPassword
    // retrive the new password from the request body    
    let updatedPassword = SessionRequest.body.newPassword
    // get the user's Id from the session    
    let userId = session.getUserId()
    // get the signed in user's email from the getUserById function    
    let userInfo = await EmailPassword.getUserById(userId)
    if (userInfo === undefined) {        
      throw new Error("Should never come here")    
    }
    // call signin to check that input password is correct    
    let isPasswordValid = await EmailPassword.signIn(userInfo.email, oldPassword)
    if (isPasswordValid.status !== "OK") {        
      // TODO: handle incorrect password error        
      return;    
    }
    // update the user's password using updateEmailOrPassword    
    let response = await EmailPassword.updateEmailOrPassword({        
      userId,        
      password: updatedPassword    
    });

    // revoke all sessions for the user    
    await Session.revokeAllSessionsForUser(userId)
    // revoke the current user's session, we do this to remove the auth cookies, logging out the user on the frontend.    
    await req.session.revokeSession()

    if (!response){
      return res.status(500);
    }
    return res.status(200).json({"message" : "Successfully Changing password!"})
  }
);
// Add this AFTER all your routes
app.use(errorHandler());

module.exports = router;
