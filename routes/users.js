var express = require("express");
var router = express.Router();
var EmailPassword = require('supertokens-node/recipe/emailpassword');
let supertoken = require('supertokens-node/framework/express');
let { verifySession } = require('supertokens-node/recipe/session/framework/express');
let Session = require('supertokens-node/recipe/session');
const Users = require('./../models/users');
const FollowsUser = require('./../models/userFollowsUser');
const cookieParser = require('cookie-parser');
let app = express();
let req = supertoken.SessionRequest;

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/profile", verifySession(), async (req, res) => {
  // get the supertokens session object from the req
  let session = req.session;
  // get the user's Id from the session
  let userId = session.getUserId();
  res.cookie('user_id', userId);
  let profile;

  try {
    let userData = await Users.scope("profile").findAll({
      where: {
        user_id: userId,
      },
    });
    profile = userData;
  } catch (e) {
    return res.status(500).send(e);
  }
  return res.status(200).json(profile[0]);
});
router.put("/edit-profile", async (req, res) => {
  // get the supertokens session object from the req
  let cookies = req.cookies;

  //verifySession()
  if (cookies === undefined){
    return res.status(401).send("Please login first!");
  }

  // get the user's Id from the session
  let userId = cookies.user_id;

  let data;

  let field = req.body;
  try {
    data = await Users.update(
    {
      nama_pengguna : field.nama_pengguna,
      nama : field.nama,
      bio: field.bio,
      tanggal_lahir: field.tanggal_lahir,
      domisili: field.domisili,
      pekerjaan: field.pekerjaan
    },
    {
      where : {
        user_id : userId
      }
    });
  } catch (e){
    return res.status(500).send(e);
  }
  return res.status(200).json({message : 'Successfully Updating Profile!'});

});
router.put("/change-password", async (req, res) => {
  // get the supertokens session object from the req
  let cookies = req.cookies;
  // retrive the old password from the request body
  let oldPassword = req.body.oldPassword;
  // retrive the new password from the request body
  let updatedPassword = req.body.newPassword;
  // get the user's Id from the session
  let userId = cookies.user_id;
  // get the signed in user's email from the getUserById function
  let userInfo = await EmailPassword.getUserById(userId);
  if (userInfo === undefined) {
    throw new Error("Should never come here");
  }

  // call signin to check that input password is correct
  let isPasswordValid = await EmailPassword.signIn(userInfo.email, oldPassword);
  if (isPasswordValid.status !== "OK") {
    // TODO: handle incorrect password error
    return;
  }

  // update the user's password using updateEmailOrPassword
  let response = await EmailPassword.updateEmailOrPassword({
    userId,
    password: updatedPassword,
  });

  // revoke all sessions for the user
  await Session.revokeAllSessionsForUser(userId);
  // revoke the current user's session, we do this to remove the auth cookies, logging out the user on the frontend.
  await req.session.revokeSession();
  if (!response) {
    return res.status(500);
  }

  return res.status(200).json({"message" : "Successfully Changing password!"});
});
router.post('/:user_id/follow', verifySession(), async (req, res) => {
  // get the supertokens session object from the req
  let session = req.session;
  // get the user's Id from the session
  let userId = session.getUserId();
  let toFollow = req.params.user_id;

  const userHasAlreadyFollowed = await FollowsUser.findOne({
    where: { id_pengikut: userId, id_diikuti: toFollow },
  });

  try {
    if (!userHasAlreadyFollowed){
      await FollowsUser.create({
        id_pengikut: userId,
        id_diikuti: toFollow
      });
    }else{
      await FollowsUser.destroy({
        where: {
          id_pengikut: userId,
          id_diikuti: toFollow
        }
      });
    }
  } catch (error) {
    return res.status(500).send("Error occured when trying to follow/unfollow a user!");
  }

  return res.status(200).send("You followed/unfollowed a user!");
});

// Add this AFTER all your routes
app.use(supertoken.errorHandler());

module.exports = router;
