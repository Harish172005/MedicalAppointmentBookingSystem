// routes/authRoutes.js
import express from "express";
import { verifyToken, register, login, getUserProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getUserById } from "../controllers/authController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();
router.get("/verify", verifyToken);
router.post("/register", upload.single("idProof"), register);
router.post("/login", login);
router.get("/user-profile", protect, getUserProfile); 
router.get("/:id", getUserById);
export default router;
