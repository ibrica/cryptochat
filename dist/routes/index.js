"use strict";
/**
 * Default routes
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
/**
 * Home page
 */
router.get("/", (req, res, next) => {
    res.render('index', { title: 'P2P Consulting' });
});
exports.indexRoutes = router;
//# sourceMappingURL=index.js.map