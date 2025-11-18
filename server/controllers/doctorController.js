// controllers/doctorController.js
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import Availability from "../models/Availability.js";

/**
 * @desc Get all unique specializations
 */
export const getSpecializations = async (req, res) => {
  try {
    const specializations = await Doctor.distinct("specialization");
    res.json(specializations);
  } catch (error) {
    console.error("Error fetching specializations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get doctors by specialization
 */

export const getDoctorsBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;

    // Find doctor IDs with this specialization
    const doctors = await Doctor.find({
      specialization: { $regex: `^${specialization}$`, $options: "i" }
    }).populate("user", "name email");

    // Get doctor IDs who have availability
   

    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors by specialization:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialization,
      availability
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor"
    });

    const newDoctor = await Doctor.create({
      user: newUser._id,
      specialization, // ✅ Save file path
    });

    if (Array.isArray(availability) && availability.length > 0) {
      const availabilityDocs = availability.map(slot => ({
        doctor: newDoctor._id,
        date: slot.date,
        timeSlots: slot.timeSlots
      }));
      await Availability.insertMany(availabilityDocs);
    }

    res.status(201).json({
      message: "Doctor registered successfully",
      doctorId: newDoctor._id
    });
  } catch (error) {
    console.error("Error registering doctor:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// GET all doctors
export const getAllDoctors = async (req, res) => {
  try {
    // Populate user details for each doctor
    const doctors = await Doctor.find()
      .populate("user", "name email role idProof experience qualification description")
      .lean();

    // Format response
    const formattedDoctors = doctors.map((doc) => ({
      _id: doc._id,
      name: doc.user.name,
      email: doc.user.email,
      specialization: doc.specialization,
      experience: doc.user.experience,
      qualification: doc.user.qualification,
      description: doc.user.description,
      idProof: doc.user.idProof, // filename/path for doctor ID proof
    }));

    return res.status(200).json(formattedDoctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get all doctors
 */
// controllers/doctorController.js

// Get single doctor profile (for edit)
export const getDoctorProfile = async (req, res) => {
  try {
    // If you're using JWT, you can get userId from req.user.id
    const doctor = await Doctor.findOne({ user: req.user.id })
      .populate("user", "name email")
      .lean();

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Get availability separately
    const availability = await Availability.find({ doctor: doctor._id });

    res.json({
      _id: doctor._id,
      name: doctor.user.name,
      email: doctor.user.email,
      specialization: doctor.specialization,
      availability
    });
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params; // doctorId
    const { name, email, password, specialization, availability } = req.body;

    // 1️⃣ Find doctor by ID
    const doctor = await Doctor.findById(id).populate("user");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // 2️⃣ Update User details
    if (name) doctor.user.name = name;
    if (email) doctor.user.email = email;
    if (password) {
      doctor.user.password = await bcrypt.hash(password, 10);
    }
    await doctor.user.save();

    // 3️⃣ Update Doctor details
    if (specialization) doctor.specialization = specialization;
    await doctor.save();

    // 4️⃣ Update Availability
    if (Array.isArray(availability)) {
      // Remove old availability
      await Availability.deleteMany({ doctor: doctor._id });

      // Insert new availability
      const availabilityDocs = availability.map(slot => ({
        doctor: doctor._id,
        date: slot.date,
        timeSlots: slot.timeSlots
      }));
      await Availability.insertMany(availabilityDocs);
    }

    res.json({ message: "Doctor updated successfully" });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({ message: "Server error" });
  }
};

