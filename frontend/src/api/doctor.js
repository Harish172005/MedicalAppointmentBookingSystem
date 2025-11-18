// src/api/doctor.js
import API from "../utils/axios";

export const listDoctors = () => API.get("/doctors"); // GET /api/doctors
export const getDoctorAppointments = () => API.get("/doctor/appointments"); // GET /api/doctor/appointments (protected)
export const updateAvailability = (slots) => API.post("/doctor/availability", { slots }); // POST protected
export const getDoctorProfile = () => API.get("/doctor/profile"); // GET protected
export const updateDoctorProfile = (data) => API.post("/doctor/update-profile", data);

export const fetchSpecializations = () => API.get("/doctors/specializations");

export const fetchDoctorsBySpecialization = (specialization) =>
  API.get(`/doctors/specialization/${specialization}`);





