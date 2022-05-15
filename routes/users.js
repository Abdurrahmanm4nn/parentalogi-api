var express = require("express");
var router = express.Router();
const { sequelize } = require("./../models/baseModel");
var EmailPassword = require("supertokens-node/recipe/emailpassword");
let supertoken = require("supertokens-node/framework/express");
let {
  verifySession,
} = require("supertokens-node/recipe/session/framework/express");
let Session = require('supertokens-node/recipe/session');
const Users = require('./../models/users');
const FollowsUser = require('./../models/userFollowsUser');
const ReadingList = require('./../models/readingList');
const UserLikesToPost = require("./../models/userLikesToPost");
const UserFollowsTag = require("./../models/userFollowsTag");
const cookieParser = require('cookie-parser');
let app = express();
const fetch = require("fetch-base64");
const getProfilePicture = require("./../utils/photoUpload");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/profile", verifySession(), async (req, res) => {
  // get the supertokens session object from the req
  let session = req.session;
  // get the user's Id from the session
  let userId = session.getUserId();
  res.cookie("user_id", userId);
  let profile;
  let following;
  let followedBy;

  try {
    following = await FollowsUser.count({
      where: {
        id_pengikut: userId
      }
    });
    followedBy = await FollowsUser.count({
      where: {
        id_diikuti: userId
      }
    });
    let userData = await Users.scope("profile").findAll({
      where: {
        user_id: userId,
      },
    });
    userData[0].setDataValue("following", following);
    userData[0].setDataValue("followedBy", followedBy);
    profile = userData;
  } catch (e) {
    return res.status(500).send(e);
  }
  return res.status(200).json(profile[0]);
});
router.put("/edit-profile", verifySession(), async (req, res) => {
  let userId = req.session.getUserId();
  let data;

  const { nama_pengguna, nama, bio, tanggal_lahir, domisili, pekerjaan } =
    req.body;
  const nameURLParsed = nama.toLowerCase().replace(/\s+/g, "-");
  const base64AnonProfilePicture = await fetch.remote(
    `https://avatars.dicebear.com/api/initials/${nameURLParsed}.png`
  );
  const profilePictureFilename = getProfilePicture(
    req.body.profilePicture || base64AnonProfilePicture[0],
    "avatar"
  );

  try {
    data = await Users.update(
      {
        nama_pengguna: nama_pengguna,
        nama: nama,
        bio: bio,
        tanggal_lahir: tanggal_lahir,
        domisili: domisili,
        pekerjaan: pekerjaan,
        foto_profil: profilePictureFilename,
      },
      {
        where: {
          user_id: userId,
        },
      }
    );
  } catch (e) {
    return res.status(500).send(e);
  }
  return res.status(200).json({ message: "Successfully Updating Profile!" });
});
router.put("/change-password", verifySession(), async (req, res) => {
  let session = req.session;
  // get the user's Id from the session
  let userId = session.getUserId();
  // get the signed in user's email from the getUserById function
  let userInfo = await EmailPassword.getUserById(userId);
  if (userInfo === undefined) {
    throw new Error("Should never come here");
  }

  // call signin to check that input password is correct
  let oldPassword = req.body.oldPassword;
  let updatedPassword = req.body.newPassword;
  let isPasswordValid = await EmailPassword.signIn(userInfo.email, oldPassword);
  if (isPasswordValid.status !== "OK") {
    // TODO: handle incorrect password error
    return res.status(401).send("Password lama yang anda masukkan salah!");
  }

  // update the user's password using updateEmailOrPassword
  let result;
  
  try {
    result = await EmailPassword.updateEmailOrPassword({
      userId,
      password: updatedPassword,
    });
  } catch (error) {
    return res.status(500).send("Terjadi error saat mengganti password");
  }

  return res.status(200).json({ message: "Successfully Changing password!" });
});
router.post('/:username/follow', verifySession(), async (req, res) => {
  // get the supertokens session object from the req
  let session = req.session;
  // get the user's Id from the session
  let userId = session.getUserId();
  let userNameToFollow = req.params.username;
  let userHasAlreadyFollowed;

  try {
    let designatedUserId = await Users.findAll({
      where: {
        nama_pengguna: userNameToFollow
      },
      attributes: ['user_id']
    });
    let toFollow = designatedUserId[0].getDataValue("user_id");
    userHasAlreadyFollowed = await FollowsUser.findOne({
      where: { id_pengikut: userId, id_diikuti: toFollow },
    });
    // check whether the user has already liked the comment
    if (userHasAlreadyFollowed === null) {
      // start transaction
      const result = await sequelize.transaction(async (t) => {

        const followingUser = await FollowsUser.create(
          {
            id_pengikut: userId,
            id_diikuti: toFollow
          },
          { transaction: t }
        );

        return followingUser;
      });

      if (!result)
        return res.status(400).json({ message: "Following user failed!" });
    } else {
      // start transaction
      const result = await sequelize.transaction(async (t) => {

        const unfollowingUser = await FollowsUser.destroy(
          {
            where: {
              id_pengikut: userId,
              id_diikuti: toFollow
            }
          },
          { transaction: t }
        );

        return unfollowingUser;
      });
      if (!result)
        return res.status(400).json({ message: "Unfollowing user failed!" });
    }
  } catch (e) {
    return res.status(500).send(e);
  }
  const msg = `Successfully ${
    userHasAlreadyFollowed === null ? "following" : "unfollowing"
  } user!`;
  return res.status(200).json({ message: msg });
});
router.get("/reading-list", verifySession(), async (req, res) => {
  // get the supertokens session object from the req
  let session = req.session;
  // get the user's Id from the session
  let userId = session.getUserId();
  let result;

  try {
    result = await ReadingList.findAll({
      where: {
        id_user: userId
      }
    });
  } catch (error) {
    return res.status(500).send("Error occured when trying to get your reading list!");
  }

  return res.status(200).json(result);
});
router.get("/liked-posts", verifySession(), async (req, res) => {
  // get the supertokens session object from the req
  let session = req.session;
  // get the user's Id from the session
  let userId = session.getUserId();
  let result;

  try {
    result = await UserLikesToPost.findAll({
      where: {
        id_user: userId
      }
    });
  } catch (error) {
    return res.status(500).send("Error occured when trying to get your liked posts!");
  }

  return res.status(200).json(result);
});
router.get("/followed-users", verifySession(), async (req, res) => {
  // get the supertokens session object from the req
  let session = req.session;
  // get the user's Id from the session
  let userId = session.getUserId();
  let result = [];

  try {
    let followedId = await FollowsUser.findAll({
      where: {
        id_pengikut: userId
      },
      attributes: ['id_diikuti']
    });
    let userLists = [];
    for (const key in followedId) {
      userLists.push(followedId[key].getDataValue('id_diikuti'));
    }
    for (const key in userLists) {
      //console.log(userLists[key]);
      let records = await Users.scope("sneak-peek").findOne({
        where: {
          user_id: userLists[key]
        }
      });
      result[key] = records;
    }
  } catch (error) {
    return res.status(500).send(error);
  }

  return res.status(200).json(result);
});
router.get("/followed-tags", verifySession(), async (req, res) => {
  // get the supertokens session object from the req
  let session = req.session;
  // get the user's Id from the session
  let userId = session.getUserId();
  let result;

  try {
    result = await UserFollowsTag.findAll({
      where: {
        id_user: userId
      }
    });
  } catch (error) {
    return res.status(500).send("Error occured when trying to get your followed tags!");
  }

  return res.status(200).json(result);
});
router.get("/:username", verifySession({sessionRequired: false}), async (req, res) => {
  let result;
  let following;
  let followedBy;
  let userId;
  let username = req.params.username;

  try {
    result = await Users.scope("profile").findAll({
      where: {
        nama_pengguna: username
      },
    });
    userId = await Users.findAll({
      where: {
        nama_pengguna: username
      },
      attributes: ['user_id']
    });
    following = await FollowsUser.count({
      where: {
        id_pengikut: userId[0].getDataValue("user_id")
      }
    });
    followedBy = await FollowsUser.count({
      where: {
        id_diikuti: userId[0].getDataValue("user_id")
      }
    });
    result[0].setDataValue("following", following);
    result[0].setDataValue("followedBy", followedBy);
  } catch (error) {
    return res.status(500).send({
      "What happened": "Error occured while retrieving profile data for this user!",
      "Error": error
    });
  }

  return res.status(200).json(result[0]);
});

// Add this AFTER all your routes
app.use(supertoken.errorHandler());

module.exports = router;
