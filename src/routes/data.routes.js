import { Router } from "express";
import { getDataUser, updateSafeFence } from "../controllers/index.js";

const router = Router();

router.get("/data/user/:userId", getDataUser);

router.put("/data/safefence", updateSafeFence);

export default router;
