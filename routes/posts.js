var express = require("express");
var router = express.Router();
var EmailPassword = require("supertokens-node/recipe/emailpassword");
let supertoken = require("supertokens-node/framework/express");
let { verifySession } = require("supertokens-node/recipe/session/framework/express");
const Posts = require('./../models/posts');
const UserLikesToPost = require('./../models/userLikesToPost');
const PostToTag = require('./../models/postToTag');
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

router.get('/', async function(req, res, next) {
  let data;
  let query = req.query;

  if (query.page && query.limit && !query.id && !query.tag){
    const { limit, offset } = getPagination(query.page, query.limit);
    try {
      data = await Posts.scope('toView').findAndCountAll({
        order: [['id', 'DESC']],
        limit: limit,
        offset: offset
      });
      data = getPagingData(data, query.page, limit);
    } catch (error) {
      res.status(500).send({
        message:
          error || "Some error occurred while retrieving articles."
      });
    }
  }else {
    try {
      data = await Posts.scope('toView').findAll({
        order: [['id', 'DESC']],
        where: query
      })
    } catch (error) {
      res.status(500).send({
        message:
          error || "Some error occurred while retrieving articles."
      });
    }
  }

  return res.status(200).json(data);
});
router.post("/", verifySession(), async (req, res) => {
  const userId = req.session.getUserId();
  let postTitle = req.body.judul;
  let tags_id = req.body.tags_id;
  let postContent = req.body.isi_text;
  let slug = postTitle.replace(/\s/g, '-');

  try{
    await Posts.create({
      id_penulis: userId,
      slug: slug,
      judul: postTitle,
      isi_text: postContent,
      updatedAt: sequelize.NOW
    });
    const postId = await Posts.findOne({
      attributes: {
        include: ['id']
      },  
      where: {
        slug: slug
      }
    });
    for (let i in tags_id){
      await PostToTag.create({
        id_post: postId,
        id_tag: tags_id[i]
      });
    }
  }catch(e){
    return res.status(500).send(e);
  }
  
  return res.status(200).send("Successfully Creating a Post!");
});
router.get('/:slug', async function(req, res, next) {
  let data;
  
  let slug = req.params.slug;

  try {
    data = await Posts.scope('toView').findAll({
      where: {
        slug: slug
      }
    });
  } catch (error) {
    res.status(500).send({
      message:
        error || "Some error occurred while retrieving articles."
    });
  }

  return res.status(200).json(data);
});
router.put("/:slug", verifySession(), async (req, res) => {
  const userId = req.session.getUserId();
  let postTitle = req.body.judul;
  let tags_id = req.body.tags_id;
  let postContent = req.body.isi_text;
  let slug = req.params.slug;
  let newSlug = postTitle.replace(/\s/g, '-');

  const postId = await Posts.findOne({
    attributes: {
      include: ['id']
    },  
    where: {
      slug: slug
    }
  });

  try{
    await Posts.update({
      slug: newSlug,
      judul: postTitle,
      isi_text: postContent,
      updatedAt: sequelize.NOW
    },
    {
      where: {
        id_penulis: userId,
        slug: slug
      }
    });
    for (let i in tags_id){
      await PostToTag.update({
        id_tag: tags_id[i]
      },
      {
        where: {
          id_post: postId
        }
      });
    }
  }catch(e){
    return res.status(500).send(e);
  }
  
  return res.status(200).send("Successfully Editing a Post!");
});
router.delete("/:slug", verifySession(), async (req, res) => {
  const userId = req.session.getUserId();
  let slug = req.params.slug;

  try{
    await Posts.destroy({
      where: {
        id_penulis: userId,
        slug: slug
      }
    })
  }catch(e){
    return res.status(500).send(e);
  }
  
  return res.status(200).send("Successfully Deleting a Post!");
});
router.post("/:slug/like", verifySession(), async (req, res) => {
  const userId = req.session.getUserId();
  let slug = req.params.slug;
  
  const postId = await Posts.findOne({
    attributes: {
      include: ['id']
    },  
    where: {
      slug: slug
    }
  });

  const userHasAlreadyLiked = await UserLikesToPost.findOne({
    where: {
      id_user: userId,
      id_post: postId
    }
  });

  if (!userHasAlreadyLiked){
    try {
      await Posts.increment({
        jumlah_disukai: 1
      },
      {
        where: {
          slug: slug,
          id_post: postId
        }
      })
      await UserLikesToPost.create({
        id_user: userId,
        id_post: postId
      });
    } catch (error) {
      return res.status(500).send(error);
    }
    return res.status(200).send("You liked a post!");
  }else{
    try {
      await Posts.decrement({
        jumlah_disukai: 1
      },
      {
        where: {
          slug: slug,
          id_post: postId
        }
      });
      await UserLikesToPost.destroy({
        id_user: userId,
        id_post: postId
      });
    } catch (error) {
      return res.status(500).send(error);
    }
    return res.status(200).send("You liked a post!");
  } 
});

app.use(supertoken.errorHandler());

module.exports = router;