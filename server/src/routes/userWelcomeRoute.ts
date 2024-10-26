import express from "express";

import { welcomeUser} from "../controllers/welcomeUserController";
import { ensureAuthenticated } from "../middleware/auth";

const router = express.Router();

// Apply the middleware to the routes that require authentication
router.get('/', ensureAuthenticated, welcomeUser);


export default router;
