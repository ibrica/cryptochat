import * as express from 'express';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import { Request, Response, NextFunction } from "express";
import { indexRoutes } from './routes';
import { userRoutes } from './routes/users';


class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    
    this.middlewares();
    this.routes();
    this.catchErrors();
  }
  
  
  /**
   * Middlewares
   */
  private middlewares(): void {
    // this.app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
    // view engine setup
    this.app.set('views', path.join(__dirname, '../views'));
    this.app.set('view engine', 'ejs');

    this.app.use(logger('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(
      express.static(path.join(__dirname, "../public"), { maxAge: 31557600000 })
    );
  }
  
  
  /**
   * Error Handlers
   */
  private catchErrors(): void {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const err: any = new Error("Not Found");
      err.status = 404;
      
      next(err);
    });
    
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      const statusCode = err.status || 500;
      
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};
      
      res.status(statusCode).send("Server Error");
    });
  }
  
  
  /**
   * Api Routes
   */
  private routes(): void {
    this.app.use("/", indexRoutes);
    this.app.use("/user", userRoutes);
  }

 

}
export default new App().app;





