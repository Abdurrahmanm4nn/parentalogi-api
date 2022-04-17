var express = require('express');
var router = express.Router();
var EmailPassword = require('supertokens-node/recipe/emailpassword');
let supertoken = require('supertokens-node/framework/express');
let { verifySession } = require('supertokens-node/recipe/session/framework/express');
const Users = require('./../models/users');
let app = express();
let req = supertoken.SessionRequest;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get("/profile", verifySession(), async (req, res) => {
  // get the supertokens session object from the req
  let session = req.session;
  // get the user's Id from the session
  let userId = session.getUserId();
  let profile;

  try {
    let userData = await Users.scope('profile').findAll({
      where : {
        user_id : userId
      }
    });
    profile = userData;
  }catch (e){
    return res.status(500).send(e);
  }
  return res.status(200).json(profile[0]);
});
router.put("/edit-profile", verifySession({sessionRequired: false}), async (req, res) => {
  // get the supertokens session object from the req
  let session = req.session;
  // get the user's Id from the session
  let userId = session.getUserId();
  let data;
  //return res.status(200).json({
  //  data: userId
  //});

  try {
    data = await Users.update(
    {
      nama_pengguna : formFields.filter((f) => f.id === "nama_pengguna")[0].value,
      nama : formFields.filter((f) => f.id === "nama")[0].value,
      bio: formFields.filter((f) => f.id === "bio")[0].value,
      tanggal_lahir: formFields.filter((f) => f.id === "tanggal_lahir")[0].value,
      domisili: formFields.filter((f) => f.id === "domisili")[0].value,
      pekerjaan: formFields.filter((f) => f.id === "pekerjaan")[0].value,
    },
    {
      where : {
        id : userId
      }
    });
  }catch (e){
    return res.status(500).send(e);
  }
  return res.status(200).json({
    message : 'Successfully Updating Profile!',
    data: data
  });

});
router.put("/change-password", verifySession(), async (req, res) => {
  // get the supertokens session object from the req
  let session = req.session;
  // retrive the old password from the request body
  let oldPassword = req.body.oldPassword;
  // retrive the new password from the request body
  let updatedPassword = req.body.newPassword;
  // get the user's Id from the session
  let userId = session.getUserId();
  // get the signed in user's email from the getUserById function
  let userInfo = await EmailPassword.getUserById(userId);
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
});

// Add this AFTER all your routes
app.use(supertoken.errorHandler());

module.exports = router;
