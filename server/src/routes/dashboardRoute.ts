import express from "express";
import { dashboardUser, claimPoints, updateWallet, deleteWallet} from "../controllers/dashboardController";
import { ensureAuthenticated } from "../middleware/auth";

const router = express.Router();

// Main dashboard route
router.get("/", ensureAuthenticated, dashboardUser);

// Claim points route
router.post("/claim-points", ensureAuthenticated, claimPoints);

//update wallet address
router.post("/update-wallet", ensureAuthenticated, updateWallet);

//delete wallet address 
router.post('/delete-wallet', deleteWallet);

export default router;
