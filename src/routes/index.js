"use strict";
/**
 * Default routes
 */
exports.__esModule = true;
var express_1 = require("express");
var router = express_1.Router();
/**
 * Home page
 */
router.get("/", function (req, res, next) {
    res.render('index', { title: 'P2P Consulting' });
});
exports.indexRoutes = router;
