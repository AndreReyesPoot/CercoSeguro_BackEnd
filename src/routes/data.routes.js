import { Router } from "express";
import {
	getDataUser,
	updateLocated,
	updateSafeFence,
} from "../controllers/index.js";

const router = Router();

// * se crean las rutas para su funcionamiento
router.get("/data/user/:userId", getDataUser);

router.put("/data/safefence", updateSafeFence);

router.post("/data/updatelocated", updateLocated);
router.put("/data/updatelocated", updateLocated);

export default router;