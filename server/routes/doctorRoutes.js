import express from "express";
import {
  getSpecializations,
  getDoctorsBySpecialization,
  createDoctor,
  getAllDoctors,
  getDoctorProfile,
  updateDoctor
} from "../controllers/doctorController.js";
import { protect,isDoctor } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/specializations", getSpecializations);
router.get("/specialization/:specialization", getDoctorsBySpecialization);
// route
router.post("/register",  createDoctor);

import { getAppointmentsByDoctor } from "../controllers/appointmentController.js";
// GET all appointments for a doctor
router.get("/",getAllDoctors);

router.get("/:doctorId", protect, isDoctor, getDoctorProfile); // Doctor gets own profile
router.put("/profile", protect, isDoctor, updateDoctor);

export default router;
