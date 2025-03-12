import express from "express";
import * as MessageCTL from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/users", protectRoute, MessageCTL.getAllUsersForSidebar);

router.get("/:id", protectRoute, MessageCTL.getMessages);

router.post("/send/:id", protectRoute, MessageCTL.sendMessage);

export default router;
