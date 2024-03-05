import { Router } from "express";
import {
	loginUser,
	registerUser,
	safe_fence,
	supervised_user,
} from "../controllers/index.js";

const router = Router();

router.post("/auth/login", loginUser);

router.post("/auth/register", registerUser);

router.post("/auth/safe_fence", safe_fence);

router.post("/auth/supervised_user", supervised_user);

export default router;
