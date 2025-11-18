import React, { useEffect, useState } from "react";
import { fetchSpecializations, fetchDoctorsBySpecialization } from "../../api/doctor";
import { bookAppointment } from "../../api/user";
import { fetchDoctorAvailability } from "../../api/availability";
import { getUser } from "../../utils/auth";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";

const BookAppointment = () => {
  const user = getUser(); // Logged-in patient
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(""); // doctorId

  const [date, setDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [timeSlot, setTimeSlot] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch specializations
  useEffect(() => {
    fetchSpecializations()
      .then(res => setSpecializations(res.data))
      .catch(err => console.error("Error fetching specializations:", err));
  }, []);

  // Fetch doctors for selected specialization
  useEffect(() => {
    if (selectedSpecialization) {
      fetchDoctorsBySpecialization(selectedSpecialization)
        .then(res => setDoctors(res.data))
        .catch(err => console.error("Error fetching doctors:", err));
    } else {
      setDoctors([]);
      setSelectedDoctor("");
    }
  }, [selectedSpecialization]);

  // Fetch doctor availability
  useEffect(() => {
    if (selectedDoctor) {
      fetchDoctorAvailability(selectedDoctor)
        .then(res => setAvailableDates(res.data))
        .catch(err => console.error("Error fetching availability:", err));
    } else {
      setAvailableDates([]);
      setAvailableTimeSlots([]);
    }
  }, [selectedDoctor]);

  // Filter slots for selected date
  useEffect(() => {
    if (date && availableDates.length) {
      const selectedDateObj = availableDates.find(av => av.date === date);
      setAvailableTimeSlots(selectedDateObj ? selectedDateObj.slots : []);
    } else {
      setAvailableTimeSlots([]);
    }
  }, [date, availableDates]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      setErrorMessage("You must be logged in to book an appointment.");
      return;
    }
  

    try {
      const payload = {
        doctorId: selectedDoctor,
        patientId: user._id,
        date,
        timeSlot
      };

      await bookAppointment(payload);

      setSuccessMessage("Appointment booked successfully!");
      setErrorMessage("");
      setSelectedSpecialization("");
      setSelectedDoctor("");
      setDate("");
      setTimeSlot("");
      setAvailableDates([]);
      setAvailableTimeSlots([]);
    } catch (err) {
      console.error("Booking error:", err);
      setErrorMessage("Failed to book appointment. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Book Appointment</h2>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Specialization</Form.Label>
              <Form.Select
                value={selectedSpecialization}
                onChange={e => setSelectedSpecialization(e.target.value)}
                required
              >
                <option value="">Select Specialization</option>
                {specializations.map((spec, idx) => (
                  <option key={idx} value={spec}>{spec}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Doctor</Form.Label>
              <Form.Select
                value={selectedDoctor}
                onChange={e => setSelectedDoctor(e.target.value)}
                required
                disabled={!selectedSpecialization}
              >
                <option value="">Select Doctor</option>
                {doctors.map(doc => (
                  <option key={doc._id} value={doc._id}>
                    {doc.user?.name || "Unnamed Doctor"}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Select
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                disabled={!selectedDoctor}
              >
                <option value="">Select Date</option>
                {availableDates.map(av => (
                  <option key={av.date} value={av.date}>{av.date}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Time Slot</Form.Label>
              <Form.Select
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value)}
                required
                disabled={!date}
              >
                <option value="">
                  {availableTimeSlots.length ? "Select Time Slot" : "No slots available"}
                </option>
                {availableTimeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <div className="text-center">
          <Button type="submit" variant="primary" disabled={!timeSlot}>
            Confirm Booking
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default BookAppointment;
