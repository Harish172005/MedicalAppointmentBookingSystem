// src/components/auth/Register.jsx
import React, { useState } from "react";
import { register } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    specialization: "",
    availability: [],
    idProof: null,
  });

  const [availabilityInput, setAvailabilityInput] = useState({
    date: "",
    slot: "",
  });

  const navigate = useNavigate();

  const specializationsList = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Pediatrics",
    "Orthopedics",
    "Psychiatry",
  ];

  const timeSlotsList = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "idProof") {
      setForm({ ...form, idProof: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddAvailability = () => {
    if (!availabilityInput.date || !availabilityInput.slot) return;

    const existing = form.availability.find(
      (av) => av.date === availabilityInput.date
    );
    if (existing) {
      existing.slots = existing.slots || [];
      if (!existing.slots.includes(availabilityInput.slot)) {
        existing.slots.push(availabilityInput.slot);
      }
    } else {
      form.availability.push({
        date: availabilityInput.date,
        slots: [availabilityInput.slot],
      });
    }

    setForm({ ...form });
    setAvailabilityInput({ date: "", slot: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("role", form.role);

      if (form.role === "doctor") {
        formData.append("specialization", form.specialization);
        formData.append("availability", JSON.stringify(form.availability));
        if (form.idProof) formData.append("idProof", form.idProof);
      }

      const res = await register(formData);
      localStorage.setItem("token", res.data.token);
      alert("Registration Successful!");
      navigate(
        form.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"
      );
    } catch (err) {
      console.error("Register failed:", err.response?.data || err.message);
      alert("Registration failed. Try again!");
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background:
          "linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 50%, #81d4fa 100%)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <motion.div
        className="card shadow-lg border-0"
        style={{
          maxWidth: 480,
          width: "100%",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
        }}
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <div className="card-body p-5">
          <motion.h3
            className="text-center mb-4 fw-bold"
            style={{
              color: "#0277bd",
              fontSize: "1.8rem",
              letterSpacing: "0.5px",
            }}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Create Your Account 🩺
          </motion.h3>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <motion.div
              className="mb-3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <label className="form-label fw-semibold">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-control p-3 rounded-3 shadow-sm"
                placeholder="Enter your full name"
                required
              />
            </motion.div>

            {/* Email */}
            <motion.div
              className="mb-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <label className="form-label fw-semibold">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="form-control p-3 rounded-3 shadow-sm"
                placeholder="example@hospital.com"
                required
              />
            </motion.div>

            {/* Password */}
            <motion.div
              className="mb-3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <label className="form-label fw-semibold">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="form-control p-3 rounded-3 shadow-sm"
                placeholder="••••••••"
                required
              />
            </motion.div>

            {/* Role */}
            <motion.div
              className="mb-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <label className="form-label fw-semibold">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="form-select p-3 rounded-3 shadow-sm"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </motion.div>

            {/* Doctor-only fields */}
            {form.role === "doctor" && (
              <>
                {/* Specialization */}
                <motion.div
                  className="mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className="form-label fw-semibold">
                    Specialization
                  </label>
                  <select
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                    className="form-select p-3 rounded-3 shadow-sm"
                    required
                  >
                    <option value="">Select specialization</option>
                    {specializationsList.map((spec, idx) => (
                      <option key={idx} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </motion.div>

                {/* ID Proof Upload */}
                <motion.div
                  className="mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className="form-label fw-semibold">
                    Upload Doctor ID Proof
                  </label>
                  <input
                    name="idProof"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleChange}
                    className="form-control p-2 rounded-3 shadow-sm"
                    required
                  />
                  <small className="text-muted">
                    (Upload hospital/medical ID proof - JPG, PNG, or PDF)
                  </small>
                </motion.div>

                {/* Availability */}
                <motion.div
                  className="mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className="form-label fw-semibold">Availability</label>
                  <div className="d-flex gap-2 mb-2">
                    <input
                      type="date"
                      value={availabilityInput.date}
                      onChange={(e) =>
                        setAvailabilityInput({
                          ...availabilityInput,
                          date: e.target.value,
                        })
                      }
                      className="form-control"
                    />
                    <select
                      value={availabilityInput.slot}
                      onChange={(e) =>
                        setAvailabilityInput({
                          ...availabilityInput,
                          slot: e.target.value,
                        })
                      }
                      className="form-select"
                    >
                      <option value="">Select Time Slot</option>
                      {timeSlotsList.map((slot, idx) => (
                        <option key={idx} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddAvailability}
                      className="btn btn-outline-primary"
                    >
                      Add
                    </button>
                  </div>

                  {form.availability.length > 0 && (
                    <ul className="list-group small shadow-sm">
                      {form.availability.map((av, idx) => (
                        <li key={idx} className="list-group-item">
                          {av.date}: {(av.slots || []).join(", ")}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "#0277bd" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="btn w-100 fw-semibold text-white py-3 rounded-3 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #29b6f6, #0288d1, #01579b)",
                border: "none",
                fontSize: "1rem",
              }}
              type="submit"
            >
              Register
            </motion.button>

            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="mb-0 text-secondary">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-decoration-none fw-semibold"
                  style={{ color: "#0277bd" }}
                >
                  Login here
                </Link>
              </p>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
