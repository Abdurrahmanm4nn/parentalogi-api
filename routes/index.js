const express = require("express");
const router = express.Router();
const supertoken = require("supertokens-node/framework/express");
const {
  errorHandler,
  middleware,
  SessionRequest,
} = require("supertokens-node/framework/express");
const {
  verifySession,
} = require("supertokens-node/recipe/session/framework/express");
const Session = require("supertokens-node/recipe/session");
const sequelize = require("sequelize");
const app = express();

router.post("/refresh", verifySession(), async (req = SessionRequest, res) => {
  const session = Session.createNewSession(res, req.cookies.user_id);

  return res.status(200).send({ message: "Session refreshed!" });
});

app.use(supertoken.errorHandler());

module.exports = router;
