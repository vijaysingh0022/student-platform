import express from "express";
import protect from "../middleware/auth.js";
import {
  connectGitHub,
  getGitHubPortfolio,
  refreshGitHubPortfolio,
  disconnectGitHub,
  testConnection,
} from "../controllers/gitHubPortfolioController.js";

const router = express.Router();

router.post("/test-connection", protect, testConnection);
router.post("/connect", protect, connectGitHub);
router.get("/portfolio", protect, getGitHubPortfolio);
router.post("/refresh", protect, refreshGitHubPortfolio);
router.post("/disconnect", protect, disconnectGitHub);

export default router;
