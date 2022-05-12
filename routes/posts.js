var express = require("express");
var router = express.Router();
var EmailPassword = require("supertokens-node/recipe/emailpassword");
let supertoken = require("supertokens-node/framework/express");
let {
  verifySession,
} = require("supertokens-node/recipe/session/framework/express");
const { sequelize } = require("./../models/baseModel");
const { Op } = require("sequelize");
const Comments = require("./../models/comments");
const Users = require("./../models/users");
const Posts = require("./../models/posts");
const Tags = require("./../models/tags");
const UserLikesToPost = require("./../models/userLikesToPost");
const PostToTag = require("./../models/postToTag");
let app = express();
let req = supertoken.SessionRequest;
const { body, param, validationResult } = require("express-validator");
const getPostCover = require("./../utils/photoUpload");

Posts.hasMany(Comments, { foreignKey: "id_post" });
Comments.belongsTo(Posts, { foreignKey: "id_post" });

Users.hasMany(Posts, { foreignKey: "id_penulis" });
Posts.belongsTo(Users, { foreignKey: "id_penulis" });

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? (page - 1) * limit : 0;
  return { limit, offset };
};

const getPagingData = (data, pageNum, limit) => {
  const { count: row_count } = data;
  const page = pageNum ? +pageNum : 0;
  const totalPages = Math.ceil(row_count / limit);
  return { data, page, row_count, totalPages };
};

async function getPost(id, slug) {
  const data = await Posts.scope("toView").findOne({
    where: {
      ...(id ? { id } : {}),
      ...(slug ? { slug } : {}),
    },
    include: [Tags, Comments],
  });
  return data;
}

function slugify(text) {
  text = text.replace(/^\s+|\s+$/g, ""); // trim
  text = text.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaaeeeeiiiioooouuuunc------";

  for (var i = 0, l = from.length; i < l; i++) {
    text = text.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  text = text
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  const min = Math.ceil(1000);
  const max = Math.floor(9999);
  const randUID = Math.floor(Math.random() * (max - min) + min);

  text += `-${randUID}`;

  return text;
}

router.get("/", async function (req, res, next) {
  let data;
  let query = req.query;

  try {
    if (query.page && query.limit && !query.id && !query.tag) {
      const { limit, offset } = getPagination(query.page, query.limit);
      data = await Posts.scope("toView").findAndCountAll({
        where: {
          ...(query.q ? { judul: { [Op.substring]: query.q } } : {}),
        },
        order: [["id", "DESC"]],
        limit: limit,
        offset: offset,
        include: [
          {
            model: Tags,
          },
          {
            model: Users,
          }
        ],
      });
      data = getPagingData(data, query.page, limit);
    } else if (query.tag) {
      data = await Tags.scope("toView").findAll({
        order: [["id", "DESC"]],
        where: {
          nama: query.tag,
        },
        include: [Posts],
      });
    } else if (query.id) {
      data = await getPost(query.id);
    } else {
      data = await Posts.scope("toView").findAll({
        where: {
          ...(query.q ? { judul: { [Op.substring]: query.q } } : {}),
        },
        order: [["id", "DESC"]],
        include: [
          {
            model: Tags,
          },
          {
            model: Users,
          }
        ],
      });
    }
  } catch (e) {
    res.status(500).send(e);
  }

  return res.status(200).json(data);
});

router.get("/:slug/comments", async function (req, res) {
  let data;

  try {
    const post = await getPost(null, slug);
    data = await Comments.findOne({
      where: {
        id_post: post.id,
      },
    });
  } catch (e) {
    return res.status(500).send(e);
  }
  return res.status(200).json(data);
});

router.post(
  "/",
  body("postTitle").exists({ checkFalsy: true }).isString(),
  body("postContent").exists({ checkFalsy: true }).isString(),
  body("postCover").if(body("postCover").notEmpty()).isBase64(),
  body("tags.*")
    .if(body("tags").isArray({ min: 1 }))
    .isNumeric()
    .custom(async (value) => {
      const tagExists = await Tags.findOne({ where: { id: value } });
      if (!tagExists) throw new Error("Tag doesn't exist!");
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
    const { postTitle, tags, postContent } = req.body;
    const slug = slugify(postTitle);
    const postCover = getPostCover(req.body.postCover, "cover");
    let data;

    try {
      data = await Posts.create({
        id_penulis: userId,
        slug: slug,
        judul: postTitle,
        isi_text: postContent,
        foto_cover: postCover,
      });
      for (const tag of tags) {
        await data.addTag(tag);
      }
    } catch (e) {
      return res.status(500).send(e);
    }

    return res
      .status(200)
      .send({ message: "Successfully creating post!", data });
  }
);

router.get("/:slug", async function (req, res, next) {
  const slug = req.params.slug;
  let data;

  try {
    data = await getPost(null, slug);
  } catch (e) {
    res.status(500).send(e);
  }

  return res.status(200).json(data);
});

router.put(
  "/:slug",
  body("postTitle").exists({ checkFalsy: true }).isString(),
  body("postContent").exists({ checkFalsy: true }).isString(),
  body("postCover").if(body("postCover").notEmpty()).isBase64(),
  param("slug")
    .isSlug()
    .custom(async (value) => {
      const slugExists = await Posts.findOne({ where: { slug: value } });
      if (!slugExists) throw new Error("Slug doesn't exist!");
      else return true;
    }),
  body("tags.*")
    .if(body("tags").isArray({ min: 1 }))
    .isNumeric()
    .custom(async (value) => {
      const tagExists = await Tags.findOne({ where: { id: value } });
      if (!tagExists) throw new Error("Tag doesn't exist!");
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
    const { postTitle, tags, postContent } = req.body;
    const slug = req.params.slug;
    const newSlug = slugify(postTitle);
    const postCover = getPostCover(req.body.postCover, "cover");
    let data;

    try {
      const result = await sequelize.transaction(async (t) => {
        const postId = await Posts.destroy(
          {
            where: {
              slug: slug,
            },
          },
          { transaction: t }
        );

        data = await Posts.create(
          {
            id_penulis: userId,
            slug: newSlug,
            judul: postTitle,
            isi_text: postContent,
            foto_cover: postCover,
          },
          { transaction: t }
        );

        return { ...postId, ...data };
      });
      for (const tag of tags) {
        await data.addTag(tag);
      }
    } catch (e) {
      return res.status(500).send(e);
    }

    return res
      .status(200)
      .send({ message: "Successfully editing post!", data });
  }
);

router.delete(
  "/:slug",
  param("slug")
    .isSlug()
    .custom(async (value) => {
      const slugExists = await Posts.findOne({ where: { slug: value } });
      if (!slugExists) throw new Error("Slug doesn't exist!");
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
    const slug = req.params.slug;

    try {
      await Posts.destroy({
        where: {
          id_penulis: userId,
          slug: slug,
        },
      });
    } catch (e) {
      return res.status(500).send(e);
    }

    return res.status(200).send({ message: "Successfully deleting post!" });
  }
);

router.put(
  "/:slug/like",
  param("slug")
    .isSlug()
    .custom(async (value) => {
      const slugExists = await Posts.findOne({ where: { slug: value } });
      if (!slugExists) throw new Error("Slug doesn't exist!");
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
    const slug = req.params.slug;
    const userId = req.session.getUserId();
    let userHasAlreadyLiked;
    const data = await getPost(null, slug);
    const { id: postId } = data.toJSON();

    try {
      userHasAlreadyLiked = await UserLikesToPost.findOne({
        where: { id_post: postId, id_user: userId },
      });
      // check whether the user has already liked the comment
      if (userHasAlreadyLiked === null) {
        // start transaction
        const result = await sequelize.transaction(async (t) => {
          // this updates comment table to increment `jumlah_disukai` attribute
          const incrementVal = await Posts.increment(
            {
              jumlah_disukai: 1,
            },
            {
              where: {
                slug: slug,
              },
            },
            { transaction: t }
          );

          const addPostUpvote = await UserLikesToPost.create(
            {
              id_user: userId,
              id_post: postId,
            },
            { transaction: t }
          );

          return incrementVal + addPostUpvote;
        });

        if (!result)
          return res.status(400).json({ message: "Liking post failed!" });
      } else {
        // start transaction
        const result = await sequelize.transaction(async (t) => {
          // this updates comment table to increment `jumlah_disukai` attribute
          const decrementVal = await Posts.decrement(
            {
              jumlah_disukai: 1,
            },
            {
              where: {
                slug: slug,
              },
            },
            { transaction: t }
          );

          const removePostUpvote = await UserLikesToPost.destroy(
            {
              where: {
                id_user: userId,
                id_post: postId,
              },
            },
            { transaction: t }
          );

          return decrementVal + removePostUpvote;
        });
        if (!result)
          return res.status(400).json({ message: "Disliking post failed!" });
      }
    } catch (e) {
      return res.status(500).send(e);
    }
    const msg = `Successfully ${
      userHasAlreadyLiked === null ? "liking" : "disliking"
    } post!`;
    return res.status(200).json({ message: msg });
  }
);

app.use(supertoken.errorHandler());

module.exports = router;
