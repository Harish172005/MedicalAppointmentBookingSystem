import express from "express";
import { 
  getDoctorAvailability,
  addDoctorAvailability,
  deleteDoctorAvailability
} from "../controllers/availabilityController.js";
import { protect, isDoctor } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:userId", getDoctorAvailability);

router.post("/:userId", addDoctorAvailability);
router.delete("/:availabilityId", deleteDoctorAvailability);

export default router;
