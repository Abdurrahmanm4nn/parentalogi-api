var express = require("express");
var router = express.Router();
var EmailPassword = require("supertokens-node/recipe/emailpassword");
let supertoken = require("supertokens-node/framework/express");
let {
  verifySession,
} = require("supertokens-node/recipe/session/framework/express");
const { sequelize } = require("./../models/baseModel");
const Posts = require("./../models/posts");
const Comments = require("./../models/comments");
const UserLikesToComment = require("./../models/userLikesToComment");
const { body, param, validationResult } = require("express-validator");
let app = express();
let req = supertoken.SessionRequest;

/* GET test. */
router.get("/", function (req, res, next) {
  res.send("respond with a stinky strange resource");
});

router.get(
  "/:comment_id",
  param("comment_id")
    .isInt()
    .custom(async (value) => {
      const commentExists = await Comments.findOne({ where: { id: value } });
      if (!commentExists) throw new Error("Comment doesn't exist!");
      else return true;
    }), 
  verifySession(), 
  async (req, res) => {
    // ------------------ validation -------------------------
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // -------------------------------------------------------
    
    const commentId = req.params.comment_id;
    let data;

    try {
      data = await Comments.findOne({
        where: {
          id: commentId,
        },
      });
    } catch (e) {
      return res.status(500).send(e);
    }
    return res.status(200).json(data);
  }
);

router.post(
  "/",
  body("postId")
    .exists({ checkFalsy: true })
    .isInt()
    .custom(async (value) => {
      const postExists = await Posts.findOne({ where: { id: value } });
      if (!postExists) throw new Error("Post is not found!");
      else return true;
    }),
  body("orangtua").exists({ checkNull: true}).isInt(),
  body("isiText").notEmpty(), 
  verifySession(), 
  async (req, res) => {
    // ------------------ validation -------------------------
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // -------------------------------------------------------
    
    const userId = req.session.getUserId();
    const { postId, orangtua, isiText } = req.body;

    try {
      // if this comment is considered child comment, check parent comment validity
      const findParent = await Comments.findOne({ where: { id: orangtua } });
      if (orangtua !== 0 && findParent === null)
        return res.status(400).json({ message: "Parent comment is not found!" });

      // check whether comment text/ content is provided
      if (isiText == "")
        return res.status(400).json({ message: "Comment content must be supplied!" });

      data = await Comments.create({
        id_penulis: userId,
        id_post: postId,
        orang_tua: orangtua,
        isi_text: isiText,
      });
    } catch (e) {
      return res.status(500).send(e);
    }
    return res.status(200).json({ message: "Successfully adding comment!", data });
  }
);

router.put(
  "/:comment_id",
  body("isiText").notEmpty(), 
  param("comment_id")
    .isInt()
    .custom(async (value) => {
      const commentExists = await Comments.findOne({ where: { id: value } });
      if (!commentExists) throw new Error("Comment doesn't exist!");
      else return true;
    }),
  verifySession(), 
  async (req, res) => {
    // ------------------ validation -------------------------
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // -------------------------------------------------------
    
    const userId = req.session.getUserId();
    const commentId = req.params.comment_id;
    const { isiText } = req.body;
    let data;

    try {
      data = await Comments.findOne({
        where: {
          id_penulis: userId,
          id: commentId
        },
      });

      if (data === null)
        return res.status(400).json({ message: "Comment is not found!" });

      if (isiText == "")
        return res.status(400).json({ message: "Comment content must be supplied!" });

      await Comments.update(
        {
          isi_text: isiText,
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
    return res.status(200).json({ message: "Successfully updating comment!" });
  }
);

router.put(
  "/:comment_id/upvote",
  param("comment_id")
    .isInt()
    .custom(async (value) => {
      const commentExists = await Comments.findOne({ where: { id: value } });
      if (!commentExists) throw new Error("Comment doesn't exist!");
      else return true;
    }), 
  verifySession(), 
  async (req, res) => {
    // ------------------ validation -------------------------
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // -------------------------------------------------------
    
    const commentId = req.params.comment_id;
    const userId = req.session.getUserId();
    let userHasAlreadyLiked;

    try {
      findPost = await Comments.findOne({ where: { id: commentId } });

      if (findPost === null)
        return res.status(400).json({ message: "Comment is not found!" });

      userHasAlreadyLiked = await UserLikesToComment.findOne({
        where: { id_comment: commentId, id_user: userId },
      });
      // check whether the user has already liked the comment
      if (userHasAlreadyLiked === null) {
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

          return incrementVal + addPostUpvote;
        });

        if (!result)
          return res.status(400).json({ message: "Liking comment failed!" });
      } else {
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
              where: {
                id_comment: commentId,
                id_user: userId,
              },
            },
            { transaction: t }
          );

          return decrementVal + removePostUpvote;
        });
        if (!result)
          return res.status(400).json({ message: "disliking comment failed!" });
      }
    } catch (e) {
      return res.status(500).send(e);
    }
    const msg = `Successfully ${
      userHasAlreadyLiked === null ? "liking" : "disliking"
    } comment!`;
    return res.status(200).json({ message: msg });
});

router.delete(
  "/:comment_id",
  param("comment_id")
    .isInt()
    .custom(async (value) => {
      const commentExists = await Comments.findOne({ where: { id: value } });
      if (!commentExists) throw new Error("Comment doesn't exist!");
      else return true;
    }), 
  verifySession(), 
  async (req, res) => {
    // ------------------ validation -------------------------
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // -------------------------------------------------------
    
    const userId = req.session.getUserId();
    const commentId = req.params.comment_id;

    try {
      const result = await sequelize.transaction(async (t) => {
        const destroyComment = await Comments.destroy(
          {
            where: {
              id_penulis: userId,
              id: commentId
            },
          },
          { transaction: t }
        );

        // ignore deleting child comment if parent comment doesn't exist
        if (destroyComment !== 0) {
          await Comments.destroy(
            {
              where: { orang_tua: commentId },
            },
            { transaction: t }
          );
        }

        return destroyComment;
      });
      if (!result) return res.status(400).json({ message: "Comment is not found!" });
    } catch (e) {
      return res.status(500).send(e);
    }

    return res.status(200).json({ message: "Successfully deleting comment!" });
  }
);

// Add this AFTER all your routes
app.use(supertoken.errorHandler());

module.exports = router;
