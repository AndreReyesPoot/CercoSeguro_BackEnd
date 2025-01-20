import { Router } from "express";
import {
	finishRegister,
	loginUser,
	registerUser,
	safe_fence,
	supervised_user,
} from "../controllers/index.js";

const router = Router();

// * se crean las rutas para su funcionamiento
router.post("/auth/login", loginUser);

router.post("/auth/register", registerUser);

router.post("/auth/safe_fence", safe_fence);

router.post("/auth/supervised_user", supervised_user);

router.post("/auth/finish_register", finishRegister);

export default router;