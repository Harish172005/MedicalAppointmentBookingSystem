import React, { useState, useEffect } from "react";
import API from "../../utils/axios";
import { getDoctorProfile } from "../../api/doctor";

const ManageAvailability = () => {
  const [doctorId, setDoctorId] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const timeSlotsList = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"];

  // 1️⃣ Load Doctor ID from backend
  const loadDoctorId = async () => {
    try {
      const res = await getDoctorProfile();
      const id = res.data._id; // Doctor Model ID
      setDoctorId(id);
      console.log("Doctor ID Loaded:", id);
    } catch (err) {
      console.error("Failed to load doctor ID:", err);
    }
  };

  // 2️⃣ Fetch availability
  const fetchAvailability = async (id) => {
    try {
      const res = await API.get(`/availability/${id}`);
      setAvailability(res.data);
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  // 3️⃣ Add availability
  const handleAddAvailability = async () => {
    if (!newDate || !selectedSlot) {
      return alert("Please choose date and time slot");
    }

    try {
      const res = await API.post(`/availability/${doctorId}`, {
        date: newDate,
        slots: [selectedSlot],
      });

      const updated = res.data;

      setAvailability((prev) => {
        const exists = prev.find((a) => a.date === newDate);
        if (exists) {
          return prev.map((a) => (a.date === newDate ? updated : a));
        }
        return [...prev, updated];
      });

      setNewDate("");
      setSelectedSlot("");

    } catch (error) {
      console.error("Error adding availability:", error);
      alert(error.response?.data?.message || "Failed to add availability");
    }
  };

  // 4️⃣ Delete availability
  const handleDeleteAvailability = async (id) => {
    try {
      await API.delete(`/availability/${id}`);
      setAvailability((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Error deleting availability:", error);
    }
  };

  // Load doctorId first → then fetch availability
  useEffect(() => {
    loadDoctorId();
  }, []);

  useEffect(() => {
    if (doctorId) fetchAvailability(doctorId);
  }, [doctorId]);

  return (
    <div className="container mt-4">
      <h2>Manage Availability</h2>

      {/* ADD NEW AVAILABILITY */}
      <div className="mb-4">
        <input
          type="date"
          className="form-control mb-2"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />

        <select
          className="form-select mb-2"
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value)}
        >
          <option value="">Select Time Slot</option>
          {timeSlotsList.map((slot) => (
            <option key={slot}>{slot}</option>
          ))}
        </select>

        <button className="btn btn-primary" onClick={handleAddAvailability}>
          Add / Update
        </button>
      </div>

      {/* LIST AVAILABILITY */}
      {availability.length === 0 ? (
        <p>No availability set yet.</p>
      ) : (
        <ul className="list-group">
          {availability.map((a) => (
            <li key={a._id} className="list-group-item d-flex justify-content-between">
              <div>
                <strong>{a.date}</strong> → {a.slots.join(", ")}
              </div>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteAvailability(a._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageAvailability;
