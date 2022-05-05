var express = require("express");
var router = express.Router();
var EmailPassword = require("supertokens-node/recipe/emailpassword");
let supertoken = require("supertokens-node/framework/express");
let { verifySession } = require("supertokens-node/recipe/session/framework/express");
const Tags = require('./../models/tags');
const UserFollowsTag = require('./../models/userFollowsTag');
let app = express();

router.get("/", async (req, res, next) => {
    let data;

    try{
        data = await Tags.findAll();
    }catch(err){
        return res.status(500).send("An error occured while fetching Categories data.");
    }

    return res.status(200).json(data);
});
router.post("/", verifySession(), async (req, res) => {
    const namaTag = req.body.namaTag;
    const deskripsiTag = req.body.deskripsiTag;
    const warnaTag = req.body.warna;

    try {
        await Tags.create({
            nama: namaTag,
            deskripsi: deskripsiTag,
            warna: warnaTag
        });
    } catch (error) {
        return res.status(500).send("An error occured while creating Tags.");
    }

    return res.status(200).send("Successfully Creating Tags!");
});
router.put("/:tagId", verifySession(), async (req, res) => {
    const namaTag = req.body.namaTag;
    const deskripsiTag = req.body.deskripsiTag;
    const warnaTag = req.body.warna;
    const tagId = req.params.tagId;

    try {
        await Tags.update({
            nama: namaTag,
            deskripsi: deskripsiTag,
            warna: warnaTag
        },
        {
            where: {id: tagId}
        });
    } catch (error) {
        return res.status(500).send("An error occured while Updating Tags.");
    }

    return res.status(200).send("Successfully Creating Tags!");
});
router.post("/:tagId/follow", verifySession(), async (req, res) => {
    const userId = req.session.getUserId();
    const tagId = req.params.tagId;

    try {
        await UserFollowsTag.create({
            id_user: userId,
            id_tag: tagId
        });
    } catch (error) {
        return res.status(500).send("An error occured.");    
    }

    return res.status(200).send("Successfully Following Tag!");
});

app.use(supertoken.errorHandler());

module.exports = router;