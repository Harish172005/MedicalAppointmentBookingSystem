// server/routes/appointmentRoutes.js
import express from "express";
import { bookAppointment, getAppointments,updateAppointmentStatus, getAppointmentsByDoctor, getAppointmentsByPatient } from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/bookAppointment", bookAppointment);
//router.get("/", getAppointments);
router.get("/doctor/:doctorId", getAppointmentsByDoctor);
router.get("/patient/:patientId", protect, getAppointmentsByPatient);
// PUT /appointments/:id/status
router.put("/:id/status", updateAppointmentStatus);


export default router;

