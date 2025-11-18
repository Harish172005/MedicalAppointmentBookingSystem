import React, { useEffect, useState } from "react";
import API from "../../utils/axios";
import { getUser } from "../../utils/auth";
import { Container, Form, Button, Spinner } from "react-bootstrap";

const EditProfileDoctor = () => {
  const user = getUser();
  const doctorId = user?.doctorId || user?._id;

  const [doctorData, setDoctorData] = useState({
    name: "",
    email: "",
    specialization: "",
    phone: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!doctorId) return;
    setLoading(true);
    API
      .get(`/doctors/${doctorId}`)
      .then((res) => setDoctorData(res.data))
      .catch((err) => console.error("Error fetching doctor profile:", err))
      .finally(() => setLoading(false));
  }, [doctorId]);

  const handleChange = (e) =>
    setDoctorData({ ...doctorData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!doctorId) return;
    setSaving(true);
    API
      .put(`/doctors/${doctorId}`, doctorData)
      .then(() => setSuccessMessage("Profile updated successfully!"))
      .catch((err) => console.error("Error updating profile:", err))
      .finally(() => setSaving(false));
  };

  return (
    <Container className="mt-4 p-4" style={{ maxWidth: "700px" }}>
      <h3 className="mb-4">Edit Profile</h3>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={doctorData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={doctorData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Specialization</Form.Label>
            <Form.Control
              type="text"
              name="specialization"
              value={doctorData.specialization}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={doctorData.phone}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="bio"
              value={doctorData.bio}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          {successMessage && (
            <p className="text-success mt-3">{successMessage}</p>
          )}
        </Form>
      )}
    </Container>
  );
};

export default EditProfileDoctor;
