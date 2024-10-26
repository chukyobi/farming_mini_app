
import express from "express";
import { ensureAuthenticated } from "../middleware/auth";
import { handleMigration } from "../controllers/migrationController";

const router = express.Router();

router.post('/',handleMigration)

export default router;
