import { NextFunction, Request, Response } from "express";
const AsyncWrapper = (
  fun: (a: Request, b: Response, c: NextFunction) => Promise<Response>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fun(req, res, next);
    } catch (e) {
      next(e);
    }
  };
};
export default AsyncWrapper;
