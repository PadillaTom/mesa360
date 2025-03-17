import express from "express";
import { upload } from "../middleware/upload";
import { authCheck } from "../middleware/auth";
import {  ProfileController } from "../controllers/profileController";

const router = express.Router();

router.put('/edit', authCheck,upload, ProfileController.edit);

export default router;