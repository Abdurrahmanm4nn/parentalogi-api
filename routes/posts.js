var express = require("express");
var router = express.Router();
var EmailPassword = require("supertokens-node/recipe/emailpassword");
let supertoken = require("supertokens-node/framework/express");
let {
  verifySession,
} = require("supertokens-node/recipe/session/framework/express");
const Posts = require("./../models/posts");
const Comments = require("./../models/posts");
const UserLikesToPost = require("./../models/userLikesToPost");
const PostToTag = require("./../models/postToTag");
let app = express();
let req = supertoken.SessionRequest;
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

async function getPostFromSlug(slug) {
  const data = await Posts.scope("toView").findOne({
    where: {
      slug: slug,
    },
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

  const randmin = Math.ceil(1000);
  const randmax = Math.floor(9999);
  const randUID = Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive

  text += `-${randUID}`;

  return text;
}

router.get("/", async function (req, res, next) {
  let data;
  let query = req.query;

  if (query.page && query.limit && !query.id && !query.tag) {
    const { limit, offset } = getPagination(query.page, query.limit);
    try {
      data = await Posts.scope("toView").findAndCountAll({
        order: [["id", "DESC"]],
        limit: limit,
        offset: offset,
      });
      data = getPagingData(data, query.page, limit);
    } catch (error) {
      res.status(500).send({
        message: error || "Some error occurred while retrieving articles.",
      });
    }
  } else {
    try {
      data = await Posts.scope("toView").findAll({
        order: [["id", "DESC"]],
        where: query,
      });
    } catch (error) {
      res.status(500).send({
        message: error || "Some error occurred while retrieving articles.",
      });
    }
  }

  return res.status(200).json(data);
});


router.get("/:slug/comments", async function (req, res) {
  const commentId = req.params.comment_id;
  let data;

  try {
    const post = await getPostFromSlug(slug);
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

router.post("/", verifySession(), async (req, res) => {
  const userId = req.session.getUserId();
  const { postTitle, tags, postContent } = req.body;
  let slug = slugify(postTitle);

  try {
    const data = await Posts.create({
      id_penulis: userId,
      slug: slug,
      judul: postTitle,
      isi_text: postContent,
    });
    for (let i in tags) {
      await PostToTag.create({
        id_post: data.id,
        id_tag: tags[i],
      });
    }
  } catch (e) {
    return res.status(500).send(e);
  }

  return res.status(200).send({ message: "Successfully creating post!" });
});

router.get("/:slug", async function (req, res, next) {
  let slug = req.params.slug;
  let data;

  try {
    data = await getPostFromSlug(slug);
  } catch (error) {
    res.status(500).send(e);
  }

  return res.status(200).json(data);
});

router.put("/:slug", verifySession(), async (req, res) => {
  const userId = req.session.getUserId();
  const { postTitle, tags, postContent } = req.body;
  let slug = req.params.slug;
  let newSlug = slugify(postTitle);

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

      const data = await Posts.create(
        {
          id_penulis: userId,
          slug: slug,
          judul: postTitle,
          isi_text: postContent,
        },
        { transaction: t }
      );

      for (let i in tags) {
        await PostToTag.create(
          {
            id_post: data.id,
            id_tag: tags[i],
          },
          { transaction: t }
        );
      }
    });
  } catch (e) {
    return res.status(500).send(e);
  }

  return res.status(200).send({ message: "Successfully editing post!" });
});

router.delete("/:slug", verifySession(), async (req, res) => {
  const userId = req.session.getUserId();
  let slug = req.params.slug;

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
});

router.put("/:slug/like", verifySession(), async (req, res) => {
  const slug = req.params.slug;
  const userId = req.session.getUserId();
  let userHasAlreadyLiked;

  try {
    findPost = await Posts.findOne({ where: { slug: slug } });

    if (findPost === null)
      return res.status(400).json({ message: "Post is not found!" });

    userHasAlreadyLiked = await UserLikesToPost.findOne({
      where: { slug: slug, id_penulis: userId },
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
            slug: slug,
            id_penulis: userId,
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
              slug: slug,
              id_penulis: userId,
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
});

app.use(supertoken.errorHandler());

module.exports = router;

