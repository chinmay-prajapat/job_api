import { Request, Response, NextFunction } from "express";
import AsyncWrapper from "../middlewares/async";
// import User from "../models/User";
import jobs from "../models/jobs";
import { createCustomError } from "../errors/error_handler";

const getAllJobs = AsyncWrapper(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>>> => {
    const job = await jobs.find({ createdBy: (req as any).user.userId });

    return res.status(200).json({ job, count: job.length });
  }
);

const getAJob = AsyncWrapper(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>>> => {
    const {
      user: { userId },
      params: { id: jobId }
    } = req as any;
    const job = await jobs.findById({
      createdBy: userId,
      _id: jobId,
      position: "fullstack"
    });
    console.log(jobId, userId);
    if (!job) {
      throw createCustomError("No job found with given id", 404);
    }
    return res.status(200).json(job);
  }
);

const createAJob = AsyncWrapper(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>>> => {
    req.body.createdBy = (req as any).user.userId;
    const job = await jobs.create(req.body);

    return res.status(200).json(job);
  }
);

const updateJob = AsyncWrapper(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>>> => {
    const {
      user: { userId },
      params: { id: jobId }
    } = req as any;
    const job = await jobs.findByIdAndUpdate(
      { _id: jobId, createdBy: userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) {
      throw createCustomError("Job not found!", 404);
    }

    return res.status(200).json(job);
  }
);

const deleteAJob = AsyncWrapper(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>>> => {
    const {
      user: { userId },
      params: { id: jobId }
    } = req as any;
    const job = await jobs.findByIdAndDelete({ _id: jobId, createdBy: userId });
    if (!job) {
      throw createCustomError(`No job found with ${jobId as string}`, 404);
    }
    return res.status(200).json(job);
  }
);
export { getAllJobs, getAJob, createAJob, updateJob, deleteAJob };
