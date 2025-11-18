import Appointment from "../models/Appointment.js";
import { sendReminderEmail } from "../utils/emailSender.js";
import { generatePDF } from "../utils/pdfGenerator.js";
import Doctor from "../models/Doctor.js";


export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, date, timeSlot } = req.body;

    // Find doctor to get its userId
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointment = new Appointment({
      doctorId: doctor.user,   // ✅ save doctor’s userId
      patientId: patientId,
      date,
      timeSlot,
    });

    await appointment.save();

    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




export const getAppointments = async (req, res) => {
  try {
    const appts = await Appointment.find({
      $or: [{ patientId: req.user.userId }, { doctorId: req.user.userId }]
    })
      .populate("doctorId")
      .populate("patientId");

    res.json(appts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getAppointmentsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointments = await Appointment.find({ patient: patientId })
      .populate("doctor", "name specialization")
      .populate("patient", "name email");

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// controllers/appointmentController.js

export const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // populate patient info from User model
    const appointments = await Appointment.find({ doctorId })
      .populate("patientId", "name email") // fetch patient details
      .lean();

    // format response
    const formatted = appointments.map(appt => ({
      _id: appt._id,
      patientName: appt.patientId?.name || "Unknown",
      patientEmail: appt.patientId?.email || "N/A",
      date: appt.date,
      timeSlot: appt.timeSlot,
      status: appt.status
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params; // or appointmentId depending on route
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const uploadPrescription = async (req, res) => {
//   const { id } = req.params;
//   const { prescription } = req.body;
//   try {
//     await Appointment.findByIdAndUpdate(id, { prescription });
//     await generatePDF(prescription, id); // creates a downloadable PDF
//     res.json({ message: "Prescription uploaded" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

