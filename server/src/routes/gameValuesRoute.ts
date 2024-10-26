
import express from "express";
import {gameValues, updatePointsFromGame} from "../controllers/gameController";
import { ensureAuthenticated } from "../middleware/auth";

const router = express.Router();

// router.get("/", ensureAuthenticated,gameValues);
// router.post('/',ensureAuthenticated, updatePointsFromGame)

router.get("/", gameValues);
router.post('/',updatePointsFromGame)

export default router;
