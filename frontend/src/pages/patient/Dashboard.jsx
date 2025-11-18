// src/pages/patient/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Container, Row, Col, Card, Button, Modal, Dropdown } from "react-bootstrap";
import { FaFilter } from "react-icons/fa"; // Filter icon

export default function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [filter, setFilter] = useState(""); // selected specialization
  const navigate = useNavigate();

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/doctors");
        setDoctors(res.data);
        setFilteredDoctors(res.data);

        // Extract unique specializations
        const specs = [...new Set(res.data.map((doc) => doc.specialization))];
        setSpecializations(specs);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  // Filter doctors by specialization
  useEffect(() => {
    if (!filter) setFilteredDoctors(doctors);
    else setFilteredDoctors(doctors.filter((doc) => doc.specialization === filter));
  }, [filter, doctors]);

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleBookAppointment = (doctorId) => {
    navigate(`/patient/book-appointment?doctorId=${doctorId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-100 py-5">
      <Container>
        <motion.h2
          className="text-center mb-4 fw-bold text-primary"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🩺 Find Your Doctor
        </motion.h2>

        {/* Filter Dropdown */}
        <div className="d-flex justify-content-center mb-4">
          <Dropdown>
            <Dropdown.Toggle variant="outline-primary" id="dropdown-specialization">
              <FaFilter /> {filter || "Filter by Specialization"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setFilter("")}>All</Dropdown.Item>
              {specializations.map((spec, idx) => (
                <Dropdown.Item key={idx} onClick={() => setFilter(spec)}>
                  {spec}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Doctor Cards */}
        <Row>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor, idx) => (
              <Col md={4} sm={6} xs={12} className="mb-4" key={doctor._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="shadow-lg rounded-4 border-0 overflow-hidden doctor-card">
                    <Card.Img
                      variant="top"
                      src={
                        doctor.idProof
                          ? `http://localhost:5000/uploads/${doctor.idProof}`
                          : "/default-doctor.jpg"
                      }
                      style={{
                        height: "240px",
                        objectFit: "cover",
                        borderBottom: "3px solid #007bff",
                      }}
                    />
                    <Card.Body className="text-center">
                      <Card.Title className="text-primary fs-5 fw-bold mb-2">
                        {doctor.name}
                      </Card.Title>
                      <Card.Subtitle className="text-muted mb-2">
                        {doctor.specialization}
                      </Card.Subtitle>
                      <p className="text-secondary small mb-3">
                        {doctor.experience
                          ? `${doctor.experience} years of experience`
                          : "Experience not available"}
                      </p>
                      <Button
                        variant="outline-primary"
                        className="w-100 fw-semibold"
                        onClick={() => handleViewDetails(doctor)}
                      >
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))
          ) : (
            <p className="text-center text-muted">No doctors found.</p>
          )}
        </Row>

        {/* Doctor Details Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Doctor Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedDoctor && (
              <Row>
                <Col md={5}>
                  <img
                    src={
                      selectedDoctor.idProof
                        ? `http://localhost:5000/uploads/${selectedDoctor.idProof}`
                        : "/default-doctor.jpg"
                    }
                    alt={selectedDoctor.name}
                    className="img-fluid rounded-3 shadow-sm"
                  />
                </Col>
                <Col md={7}>
                  <h4 className="fw-bold text-primary mb-3">{selectedDoctor.name}</h4>
                  <p>
                    <strong>Specialization:</strong> {selectedDoctor.specialization}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedDoctor.email}
                  </p>
                  <p>
                    <strong>Experience:</strong> {selectedDoctor.experience || "N/A"} years
                  </p>
                  <p>
                    <strong>Qualification:</strong> {selectedDoctor.qualification || "N/A"}
                  </p>
                  <p>
                    <strong>About:</strong> {selectedDoctor.description || "No details available."}
                  </p>
                </Col>
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button
              variant="success"
              size="lg"
              onClick={() => handleBookAppointment(selectedDoctor._id)}
            >
              Book Appointment
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Hover Effects */}
        <style jsx>{`
          .doctor-card {
            transition: all 0.3s ease-in-out;
          }
          .doctor-card:hover {
            transform: translateY(-6px) scale(1.02);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          }
        `}</style>
      </Container>
    </div>
  );
}
