import { Router } from "express";
import { checkValidation, getWearableByCode, newDevices, pairWearable, sendLocation } from "../controllers/index.js";

const router = Router();

// * se crean las rutas para su funcionamiento
router.post("/wearable/newPair", newDevices);

router.post("/wearable/pairDevices", pairWearable);

router.post("/wearable/checkValidation", checkValidation)

router.post("/wearable/getWereableId", getWearableByCode)

router.post("/wearable/location", sendLocation)

export default router;
