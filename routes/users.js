var express = require('express')
var router = express.Router()
var EmailPassword = require('supertokens-node/recipe/emailpassword')
let supertoken = require('supertokens-node/framework/express')
let { verifySession } = require('supertokens-node/recipe/session/framework/express')
let req = supertoken.SessionRequest

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/change-password", verifySession(), async (verifySession, res) => {    
    // get the supertokens session object from the req    
    let session = req.session
      // retrive the old password from the request body    
    let oldPassword = req.body.oldPassword
      // retrive the new password from the request body    
    let updatedPassword = req.body.newPassword
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
      return res.status(401).json({"message" : "Wrong Password!!"})  
    }
    // update the user's password using updateEmailOrPassword    
    let response = await EmailPassword.updateEmailOrPassword({        
      userId,        
      password: updatedPassword    
    })

    // revoke all sessions for the user    
    await Session.revokeAllSessionsForUser(userId)
    
    // TODO: send successful password update response
    return res.status(200).json({"message" : "Successfully Changing password!"})
  }
);

module.exports = router;
