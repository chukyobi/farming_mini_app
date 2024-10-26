import express from "express";
import { authUser, authTwitter } from "../controllers/userAuthController";

const router = express.Router();

// Route for authenticating user via Telegram
router.post("/telegram", authUser);

// Route for handling user authentication via Telegram Web App
router.get("/authUser", authUser);

// Route for handling Twitter follow page and follow status
router.get("/authTwitter", authTwitter);

export default router;
