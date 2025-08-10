import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
} from "../controllers/message.controller.js";
import { sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:userId", protectRoute, getMessages);

router.post(
  "/send/:userId",
  protectRoute,
  (req, res, next) => {
    console.log("Message send route hit:", req.params, req.body);
    next();
  },
  sendMessage
);

export default router;
