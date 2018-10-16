/**
 * User routes
 */
import { Router, Request, Response, NextFunction } from "express";

const router: Router = Router();

/**
 * User home route
 */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send('User ...');
});

export const userRoutes: Router = router;

