import express from "express";
import { updateUsername} from "../controllers/updateUsernameController";
import { ensureAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post('/updateUsername', ensureAuthenticated, updateUsername);

export default router;