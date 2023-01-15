import { NextFunction, Request, Response } from "express";
import { CustomAPIError } from "../errors/error_handler";

const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> => {
  if (err instanceof CustomAPIError) {
    return res.status(Number(err.statusCode)).json({ msg: err.message });
  }

  if (err.name === "ValidationError") {
    const arr = Object.values(err.errors).map((i: any) =>
      i.message.split("Please provide").join("")
    );
    const msg = arr
      .map((i: string, index) =>
        index === 0
          ? `Please provide${i}`
          : index === arr.length - 1
          ? ` and ${i}`
          : i
      )
      .join();
    return res.status(400).json(msg);
  }
  if (err.code === 11000) {
    const msg = { msg: `Duplicate ${Object.entries(err.keyValue)}` };
    return res.status(400).json(msg);
  }
  if (err.name === "CastError") {
    const msg = `No job found with ${err.value._id}`;
    return res.status(404).json(msg);
  }
  return res.status(500).json({ msg: err.message });
};
export default ErrorHandler;
