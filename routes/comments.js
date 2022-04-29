var express = require("express");
var router = express.Router();
var EmailPassword = require("supertokens-node/recipe/emailpassword");
let supertoken = require("supertokens-node/framework/express");
let {
  verifySession,
} = require("supertokens-node/recipe/session/framework/express");
const { sequelize } = require("./../models/baseModel");
const Comments = require("./../models/comments");
const UserLikesToComment = require("./../models/UserLikesToComment");
let app = express();
let req = supertoken.SessionRequest;

/* GET test. */
router.get("/", function (req, res, next) {
  res.send("respond with a stinky strange resource");
});

router.post("/", verifySession(), async (req, res) => {
  const userId = req.session.getUserId();
  const field = req.body;

  try {
    data = await Comments.create({
      id_penulis: userId,
      id_post: field.id_post,
      orang_tua: field.orang_tua,
      isi_text: field.isi_text,
    });
  } catch (e) {
    return res.status(500).send(e);
  }
  return res.status(200).json({ message: "Successfully Adding Comment!" });
});

router.put("/:comment_id", verifySession(), async (req, res) => {
  const commentId = req.params.comment_id;
  const field = req.body;

  try {
    data = await Comments.update(
      {
        isi_text: field.isi_text,
        telah_diubah: 1,
      },
      {
        where: {
          id: commentId,
        },
      }
    );
  } catch (e) {
    return res.status(500).send(e);
  }
  return res.status(200).json({ message: "Successfully Updating Comment!" });
});

router.put("/:comment_id/upvote", verifySession(), async (req, res) => {
  const commentId = req.params.comment_id;
  const userId = req.session.getUserId();

  const userHasAlreadyLiked = await UserLikesToComment.findOne({
    where: { id_comment: commentId, id_user: userId },
  });

  console.log(userHasAlreadyLiked);

  // check whether the user has already liked the comment
  if (userHasAlreadyLiked === null) {
    try {
      // start transaction
      const result = await sequelize.transaction(async (t) => {
        // this updates comment table to increment `jumlah_disukai` attribute
        const incrementVal = await Comments.increment(
          {
            jumlah_disukai: 1,
          },
          {
            where: {
              id: commentId,
            },
          },
          { transaction: t }
        );

        const addPostUpvote = await UserLikesToComment.create(
          {
            id_comment: commentId,
            id_user: userId,
          },
          { transaction: t }
        );

        return {
          ...incrementVal,
          ...addPostUpvote,
        };
      });
    } catch (e) {
      return res.status(500).send(e);
    }
    return res.status(200).json({ message: "Successfully Liking Comment!" });
  } else {
    try {
      // start transaction
      const result = await sequelize.transaction(async (t) => {
        // this updates comment table to increment `jumlah_disukai` attribute
        const decrementVal = await Comments.decrement(
          {
            jumlah_disukai: 1,
          },
          {
            where: {
              id: commentId,
            },
          },
          { transaction: t }
        );

        const removePostUpvote = await UserLikesToComment.destroy(
          {
            id_comment: commentId,
            id_user: userId,
          },
          { transaction: t }
        );

        return {
          ...decrementVal,
          ...removePostUpvote,
        };
      });
    } catch (e) {
      return res.status(500).send(e);
    }
    return res.status(200).json({ message: "Successfully Unliking Comment!" });
  }
});

// Add this AFTER all your routes
app.use(supertoken.errorHandler());

module.exports = router;
