"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const path = __importStar(require("path"));
const cookieParser = __importStar(require("cookie-parser"));
const logger = __importStar(require("morgan"));
const routes_1 = require("./routes");
const users_1 = require("./routes/users");
class App {
    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
        this.catchErrors();
    }
    /**
     * Middlewares
     */
    middlewares() {
        // this.app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
        // view engine setup
        this.app.set('views', path.join(__dirname, '../views'));
        this.app.set('view engine', 'ejs');
        this.app.use(logger('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, "../public"), { maxAge: 31557600000 }));
    }
    /**
     * Error Handlers
     */
    catchErrors() {
        this.app.use((req, res, next) => {
            const err = new Error("Not Found");
            err.status = 404;
            next(err);
        });
        this.app.use((err, req, res, next) => {
            const statusCode = err.status || 500;
            res.locals.message = err.message;
            res.locals.error = req.app.get("env") === "development" ? err : {};
            res.status(statusCode).send("Server Error");
        });
    }
    /**
     * Api Routes
     */
    routes() {
        this.app.use("/", routes_1.indexRoutes);
        this.app.use("/user", users_1.userRoutes);
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map