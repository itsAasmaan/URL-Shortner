import { Router } from "express";
import authenticationRoutes from "./authenticationRoutes.js";
import urlRoutes from "./urlRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";
import AnalyticsController from "../controllers/AnalyticsController.js";

const router = Router();

router.use("/auth", authenticationRoutes);

router.use("/urls", urlRoutes);

router.use("/analytics", analyticsRoutes);

router.get('/urls/:shortCode/stats', AnalyticsController.getURLStats);

router.get('/urls/:shortCode/clicks', AnalyticsController.getClickHistory);

export default router;
