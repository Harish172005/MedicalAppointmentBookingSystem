// controllers/availabilityController.js
import Availability from "../models/Availability.js";
import Doctor from "../models/Doctor.js";

// ✅ Get a doctor’s availability
export const getDoctorAvailability = async (req, res) => {
   try {
    const doctor = await Doctor.findOne({ user: req.params.userId });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const availability = await Availability.find({ doctor: doctor._id });
    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addDoctorAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.params.userId });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const { date, slots } = req.body;   // ✅ FIX: extract from request body

    if (!date || !slots || slots.length === 0) {
      return res.status(400).json({ message: "Date and slots are required" });
    }

    const doctorId = doctor._id;

    // Check if availability already exists for the given date
    let availability = await Availability.findOne({ doctor: doctorId, date });

    if (availability) {
      // If exists, append new slots (avoid duplicates)
      availability.slots = [...new Set([...availability.slots, ...slots])];
    } else {
      availability = new Availability({
        doctor: doctorId,
        date,
        slots,
      });
    }

    await availability.save();
    res.status(201).json(availability);
  } catch (error) {
    console.error("Error adding availability:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Delete a specific availability slot
export const deleteDoctorAvailability = async (req, res) => {
  try {
    const { availabilityId } = req.params;

    const availability = await Availability.findById(availabilityId);

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    await availability.deleteOne();
    res.json({ message: "Availability deleted successfully" });
  } catch (error) {
    console.error("Error deleting availability:", error);
    res.status(500).json({ message: "Server error" });
  }
};
