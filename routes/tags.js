var express = require("express");
var router = express.Router();
var EmailPassword = require("supertokens-node/recipe/emailpassword");
let supertoken = require("supertokens-node/framework/express");
let {
  verifySession,
} = require("supertokens-node/recipe/session/framework/express");
const Tags = require("./../models/tags");
const UserFollowsTag = require("./../models/userFollowsTag");
let app = express();

router.get("/", async (req, res, next) => {
  const tagId = req.query.id;
  let data;

  try {
    if (tagId) {
      data = await Tags.findOne({
        where: {
          id: tagId,
        },
      });
    } else {
      data = await Tags.findAll();
    }
  } catch (e) {
    return res.status(500).send(e);
  }

  return res.status(200).json(data);
});

router.post("/", verifySession(), async (req, res) => {
  const { nama, deskripsi, warna } = req.body;
  let data;

  try {
    // TODO: add validation for unfilled fields
    const findSameTagname = await Tags.findOne({
      where: { nama: nama },
    });
    if (findSameTagname)
      return res.status(400).json({ message: "Same tag name is found!" });

    data = await Tags.create({
      nama: nama,
      deskripsi: deskripsi,
      warna: warna,
    });
  } catch (e) {
    return res.status(500).send(e);
  }

  return res.status(200).send({ message: "Successfully creating tag!", data });
});

router.put("/:tag_id", verifySession(), async (req, res) => {
  const { nama, deskripsi, warna } = req.body;
  const tagId = req.params.tag_id;

  try {
    // TODO: add validation for unfilled fields
    const findTag = await Tags.findOne({ where: { id: tagId } });
    if (!findTag) return res.status(400).json({ message: "Tag not found!" });
    const findSameTagname = await Tags.findOne({ where: { nama: nama } });
    if (findSameTagname)
      return res.status(400).json({ message: "Same tag name is found!" });

    await Tags.update(
      {
        nama: nama,
        deskripsi: deskripsi,
        warna: warna,
      },
      {
        where: { id: tagId },
      }
    );
  } catch (e) {
    return res.status(500).send(e);
  }

  return res.status(200).send({ message: "Successfully updating tag!" });
});
router.put("/:tagId/follow", verifySession(), async (req, res) => {
  const userId = req.session.getUserId();
  const tagId = req.params.tagId;
  let findFollowedTag;

  try {
    const findTag = await Tags.findOne({ where: { id: tagId } });
    if (!findTag) return res.status(400).json({ message: "Tag not found!" });

    findFollowedTag = await UserFollowsTag.findOne({
      where: { id_user: userId, id_tag: tagId },
    });
    if (findFollowedTag == null) {
      await UserFollowsTag.create({
        id_user: userId,
        id_tag: tagId,
      });
    } else {
      await UserFollowsTag.destroy({
        where: {
          id_user: userId,
          id_tag: tagId,
        },
      });
    }
  } catch (e) {
    return res.status(500).send(e);
  }
  const msg = findFollowedTag == null ? "following" : "unfollowing";
  return res.status(200).send({ message: `Successfully ${msg} tag!` });
});

app.use(supertoken.errorHandler());

module.exports = router;
