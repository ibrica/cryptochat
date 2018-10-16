"use strict";
exports.__esModule = true;
/**
 * User routes
 */
var express_1 = require("express");
var router = express_1.Router();
/**
 * User home route
 */
router.get("/", function (req, res, next) {
    res.send('User ...');
});
exports.userRoutes = router;
