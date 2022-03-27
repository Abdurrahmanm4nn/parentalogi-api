var express = require('express');
var router = express.Router();
let {errorHandler} = require("supertokens-node/framework/express");
let { middleware } = require("supertokens-node/framework/express");
let app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post("/refresh", middleware(), (req, res) => {
    res.send('refreshing token');
});

// Add this AFTER all your routes
app.use(errorHandler());

module.exports = router;
