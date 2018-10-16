/**
 * Default routes
 */

import { Router, Request, Response, NextFunction } from "express";

const router: Router = Router();

/**
 * Home page
 */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.render('index', { title: 'P2P Consulting' });
});

export const indexRoutes: Router = router;

