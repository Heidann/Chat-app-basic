import express from "express";
import * as UserCTL from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", UserCTL.signup);

router.post("/login", UserCTL.login);

router.post("/logout", UserCTL.logout);

router.put("/update-profile", protectRoute, UserCTL.updateProfile);

router.get("/check", protectRoute, UserCTL.checkAuth);

export default router;
