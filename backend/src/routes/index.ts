import { Router } from "express";
import authenticationRoutes from "./authenticationRoutes.js";
import urlRoutes from "./urlRoutes.js";

const router = Router();

router.use("/auth", authenticationRoutes);

router.use("/urls", urlRoutes);

export default router;
