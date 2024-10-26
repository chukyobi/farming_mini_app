
import express from "express";
import { checkTwitter, twitterHandle,questHandleCallback, questUrl } from "../controllers/questsController";

const router = express.Router();

// router.post('/twitter',checkTwitter)
// router.post('/twitter',twitterHandle);

router.get('/twitter',questUrl)

router.post('/twitter/callback',questHandleCallback)


export default router;
