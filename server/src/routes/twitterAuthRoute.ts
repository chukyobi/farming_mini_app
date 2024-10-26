import express from "express";
import { followTwitter } from "../controllers/twitterFollowController";

const router = express.Router();

// Route for following a Twitter account
router.get("/followTwitter", followTwitter);

export default router;
