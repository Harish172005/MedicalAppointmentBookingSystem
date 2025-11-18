import React, { useState, useEffect } from "react";
import API from "../../utils/axios";

const ManageAvailability = () => {
  const [availability, setAvailability] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [newSlots, setNewSlots] = useState(""); // comma-separated slots
  const doctor = JSON.parse(localStorage.getItem("user"));
  const doctorId = doctor?._id;

  // Fetch availability for the doctor
  const fetchAvailability = async () => {
    if (!doctorId) return;
    try {
      const res = await API.get(`/availability/${doctorId}`);
      console.log("Fetched Availability:", res.data);
      setAvailability(res.data);
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  // Add or update availability for a date
  const handleAddAvailability = async () => {
    if (!newDate || !newSlots) return alert("Date and slots are required");

    const slotsArray = newSlots.split(",").map(s => s.trim());

    try {
      const res = await API.post(`/availability/${doctorId}`, {
        date: newDate,
        slots: slotsArray,
      });
      console.log("Added/Updated Availability:", res.data);

      // Replace existing date or add new
      setAvailability(prev => {
        const exists = prev.find(a => a.date === newDate);
        if (exists) {
          return prev.map(a => a.date === newDate ? res.data : a);
        }
        return [...prev, res.data];
      });

      setNewDate("");
      setNewSlots("");
    } catch (error) {
      console.error("Error adding availability:", error);
      alert(error.response?.data?.message || "Failed to add availability");
    }
  };

  // Delete entire availability entry for a date
  const handleDeleteAvailability = async (id) => {
    try {
      await API.delete(`/availability/availability/${id}`);
      setAvailability(prev => prev.filter(a => a._id !== id));
    } catch (error) {
      console.error("Error deleting availability:", error);
      alert(error.response?.data?.message || "Failed to delete availability");
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [doctorId]);

  return (
    <div className="container mt-4">
      <h2>Manage Availability</h2>

      {/* Add / Update Availability */}
      <div className="mb-4">
        <input
          type="date"
          value={newDate}
          onChange={e => setNewDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Slots (comma separated)"
          value={newSlots}
          onChange={e => setNewSlots(e.target.value)}
        />
        <button onClick={handleAddAvailability}>Add / Update</button>
      </div>

      {/* Availability List */}
      {availability.length === 0 ? (
        <p>No availability set yet.</p>
      ) : (
        <ul>
          {availability.map(a => (
            <li key={a._id}>
              <strong>{a.date}</strong> → {a.slots.join(", ")}
              <button onClick={() => handleDeleteAvailability(a._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageAvailability;
