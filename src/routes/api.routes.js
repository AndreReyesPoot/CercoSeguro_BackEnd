import { Router } from "express";
import { supervisorPUT, updatePoints } from "../controllers/index.js";

const router = Router();

// * se crean las rutas para su funcionamiento
router.put("/api/users/:userId", supervisorPUT);

router.put("/api/users/points/:userId", updatePoints);

export default router;
