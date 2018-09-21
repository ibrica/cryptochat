"use strict";
exports.__esModule = true;
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var routes_1 = require("./routes");
var users_1 = require("./routes/users");
var App = /** @class */ (function () {
    function App() {
        this.app = express();
        this.middlewares();
        this.routes();
        this.catchErrors();
    }
    /**
     * Middlewares
     */
    App.prototype.middlewares = function () {
        // this.app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
        // view engine setup
        this.app.set('views', path.join(__dirname, '../views'));
        this.app.set('view engine', 'ejs');
        this.app.use(logger('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, "../public"), { maxAge: 31557600000 }));
    };
    /**
     * Error Handlers
     */
    App.prototype.catchErrors = function () {
        this.app.use(function (req, res, next) {
            var err = new Error("Not Found");
            err.status = 404;
            next(err);
        });
        this.app.use(function (err, req, res, next) {
            var statusCode = err.status || 500;
            res.locals.message = err.message;
            res.locals.error = req.app.get("env") === "development" ? err : {};
            res.status(statusCode).send("Server Error");
        });
    };
    /**
     * Api Routes
     */
    App.prototype.routes = function () {
        this.app.use("/", routes_1.indexRoutes);
        this.app.use("/user", users_1.userRoutes);
    };
    return App;
}());
exports["default"] = new App().app;
