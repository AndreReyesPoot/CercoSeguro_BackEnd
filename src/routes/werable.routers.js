import { Router } from "express";
import { newDivices, paierWerable } from "../controllers/index.js";

const router = Router();

// * se crean las rutas para su funcionamiento
router.post("/werable/newPair", newDivices);

router.put("/werable/pairDevices", paierWerable);

export default router;
