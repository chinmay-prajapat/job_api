import { Request, Response } from "express";
import User from "../models/User";
import AsyncWrapper from "../middlewares/async";
import { createCustomError } from "../errors/error_handler";

const register = AsyncWrapper(
  async (
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> => {
    const user = await User.create({ ...req.body });

    const token = user.createJWT();
    return res.status(201).json({ user: { name }, token });
  }
);
const login = AsyncWrapper(
  async (
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw createCustomError("Please enter email and password", 400);
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw createCustomError("Invalid Credentials", 401);
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw createCustomError("Invalid Credentials", 401);
    }
    const token = user.createJWT();
    return res.status(200).json({ user: { name: user.name }, token });
  }
);
export { register, login };
