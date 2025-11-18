import React, { useEffect, useState } from "react";
import { Card, CardContent, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { format } from "date-fns";
import API from "../../utils/axios";

export default function ViewAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Get doctor info from localStorage
  const doctor = JSON.parse(localStorage.getItem("user"));
  const doctorId = doctor?._id; // use _id from doctor object
  console.log("Doctor ID:", doctorId);

  // ✅ Fetch Appointments
  const fetchAppointments = async () => {
    if (!doctorId) return; // guard
    try {
      const res = await API.get(`/appointments/doctor/${doctorId}`);
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update Status API Call
  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await API.put(`/appointments/${appointmentId}/status`, { status: newStatus });
      // Update UI immediately without refetch
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === appointmentId ? { ...appt, status: newStatus } : appt
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [doctorId]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">My Appointments</h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center">No appointments found.</div>
      ) : (
        <div className="row g-4">
          {appointments.map((appt) => (
            <div key={appt._id} className="col-md-6">
              <Card className="shadow-sm border-info">
                <CardContent>
                  <h5 className="mb-2">Patient: {appt.patientName}</h5>
                  <p><strong>Email:</strong> {appt.patientEmail}</p>
                  <p><strong>Date:</strong> {format(new Date(appt.date), "dd MMM yyyy")}</p>
                  <p><strong>Time:</strong> {appt.timeSlot}</p>

                  {/* ✅ Status Dropdown */}
                  <FormControl fullWidth size="small" className="mt-2">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={appt.status}
                      label="Status"
                      onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Confirmed">Confirmed</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
