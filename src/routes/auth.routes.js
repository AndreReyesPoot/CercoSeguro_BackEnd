import { Router } from "express";
import { loginUser, registerUser } from "../controllers/index.js";

const router = Router();

router.post("/auth/login", loginUser);

router.post("/auth/register", registerUser);

export default router;
