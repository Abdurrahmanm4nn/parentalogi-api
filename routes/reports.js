var express = require("express");
var router = express.Router();
var EmailPassword = require("supertokens-node/recipe/emailpassword");
let supertoken = require("supertokens-node/framework/express");
let {
  verifySession,
} = require("supertokens-node/recipe/session/framework/express");
const PostReport = require("./../models/PostReport");
const Users = require('./../models/users');
const Posts = require("./../models/posts");

router.get("/", verifySession(), async (req, res) => {
    const session = req.session;
    let userId = session.getUserId();

    let userData = await Users.findOne({
        where: {
            user_id: userId
        }
    });

    if (userData.role !== "ADMIN"){
        return res.status(401).send("You are not admin! Access is prohibited!");
    }

    let reportedPost;
    try {
        reportedPost = await PostReport.findAndCountAll({
            include: [
                {
                    model: Posts
                },
            ],
        });
    } catch (error) {
        return res.status(500).send(error);
    }

    return res.status(200).json(reportedPost);
});