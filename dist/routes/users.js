"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * User routes
 */
const express_1 = require("express");
const router = express_1.Router();
/**
 * User home route
 */
router.get("/", (req, res, next) => {
    res.send('User ...');
});
exports.userRoutes = router;
//# sourceMappingURL=users.js.map