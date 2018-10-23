import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import { Request, Response, NextFunction } from 'express';
import { indexRoutes } from './routes';
import { userRoutes } from './routes/users';
import {MONGODB_URI} from './config/settings';
import * as mongoose from 'mongoose';
import * as bluebird from 'bluebird';
import * as path from 'path';
import * as history from 'connect-history-api-fallback';


class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.database();
    this.routes();
    this.catchErrors();
  }

  /**
   * Middlewares config
   */
  private middlewares(): void {

    this.app.use(logger('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    // History mode for Vue
    this.app.use(history());


  }


  /**
   * Config mongo database
   */
  private database(): void {
    // Connect to MongoDB
    (<any> mongoose).Promise = bluebird;  // es6 as promise lib
    mongoose.connect(MONGODB_URI, { promiseLibrary: bluebird, useNewUrlParser: true })
      .then(() =>  console.log('connection succesful'))
      .catch((err) => console.error(err));
  }

  /**
   * Error Handlers
   */
  private catchErrors(): void {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const err: any = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      const statusCode = err.status || 500;
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(statusCode).send('Server Error');
    });
  }
  /**
   * Api Routes
   */
  private routes(): void {
    this.app.use('/', express.static(path.join(__dirname, '../../client/dist/')));     //Serve vue
    this.app.use('/user', userRoutes);
  }
}
export default new App().app;
