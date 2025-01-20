import { Router } from "express";
import { newDevices, pairWearable } from "../controllers/index.js";

const router = Router();

// * se crean las rutas para su funcionamiento
router.post("/werable/newPair", newDevices);

router.post("/werable/pairDevices", pairWearable);

export default router;
