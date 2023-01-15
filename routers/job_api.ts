import { Router } from "express";
import {
  createAJob,
  deleteAJob,
  getAJob,
  getAllJobs,
  updateJob
} from "../controllers/job_api_controllers";
const router = Router();
router.get("/", getAllJobs);
router.get("/:id", getAJob);
router.post("/", createAJob);
router.patch("/:id", updateJob);
router.delete("/:id", deleteAJob);
export default router;
