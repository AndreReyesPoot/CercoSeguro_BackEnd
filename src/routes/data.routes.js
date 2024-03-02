import { Router } from "express";
import { getDataUser } from "../controllers/index.js";

const router = Router();

router.get("/data/user/:userId", getDataUser);

export default router;
