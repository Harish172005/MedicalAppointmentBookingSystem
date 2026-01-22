import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Chip,
  Divider,
} from "@mui/material";

export default function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [specializations, setSpecializations] = useState([]);
  const [regions, setRegions] = useState([]);

  const [filterSpecialization, setFilterSpecialization] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [filterExperience, setFilterExperience] = useState("");

  const navigate = useNavigate();

  const fetchDoctors = useCallback(async () => {
    const params = {};
    if (filterSpecialization) params.specialization = filterSpecialization;
    if (filterRegion) params.region = filterRegion;
    if (filterExperience) params.experience = filterExperience;

    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/doctor`,
      { params }
    );

    setDoctors(res.data);
    setSpecializations([...new Set(res.data.map(d => d.specialization))]);
    setRegions([...new Set(res.data.map(d => d.region))]);
  }, [filterSpecialization, filterRegion, filterExperience]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return (
    <Box>
      {/* HERO SECTION */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2, #42a5f5)",
          color: "#fff",
          py: 8,
          mb: 6,
        }}
      >
        <Container>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Find the Right Doctor
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Book appointments with verified specialists near you
          </Typography>
        </Container>
      </Box>

      <Container>
        {/* FILTER BAR */}
        <Card sx={{ p: 3, mb: 5, borderRadius: 3, boxShadow: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Specialization</InputLabel>
                <Select
                  value={filterSpecialization}
                  onChange={(e) => setFilterSpecialization(e.target.value)}
                  label="Specialization"
                >
                  <MenuItem value="">All</MenuItem>
                  {specializations.map(spec => (
                    <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Region</InputLabel>
                <Select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  label="Region"
                >
                  <MenuItem value="">All</MenuItem>
                  {regions.map(reg => (
                    <MenuItem key={reg} value={reg}>{reg}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Experience</InputLabel>
                <Select
                  value={filterExperience}
                  onChange={(e) => setFilterExperience(e.target.value)}
                  label="Experience"
                >
                  <MenuItem value="">Any</MenuItem>
                  <MenuItem value="1">1+ years</MenuItem>
                  <MenuItem value="3">3+ years</MenuItem>
                  <MenuItem value="5">5+ years</MenuItem>
                  <MenuItem value="10">10+ years</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>

        {/* DOCTOR GRID */}
        <Grid container spacing={4}>
          {doctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={4} key={doctor._id}>
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "0.3s",
                  boxShadow: 4,
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 8,
                  },
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="240"
                    image={
                      doctor.idProof
                        ? `${process.env.REACT_APP_API_URL}/${doctor.idProof}`
                        : "/default-doctor.jpg"
                    }
                  />
                  <Chip
                    label={doctor.specialization}
                    sx={{
                      position: "absolute",
                      bottom: 12,
                      left: 12,
                      bgcolor: "#fff",
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    {doctor.name}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {doctor.region}
                  </Typography>

                  <Chip
                    label={`${doctor.experience} yrs experience`}
                    size="small"
                    sx={{ mb: 2 }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setShowModal(true);
                    }}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* PROFILE MODAL */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "#fff",
            borderRadius: 3,
            p: 4,
          }}
        >
          {selectedDoctor && (
            <>
              <Typography variant="h5" fontWeight={700}>
                {selectedDoctor.name}
              </Typography>
              <Typography color="text.secondary" mb={2}>
                {selectedDoctor.specialization}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Typography><strong>Email:</strong> {selectedDoctor.email}</Typography>
              <Typography><strong>Qualification:</strong> {selectedDoctor.qualification}</Typography>
              <Typography><strong>Region:</strong> {selectedDoctor.region}</Typography>
              <Typography mt={2}>{selectedDoctor.bio}</Typography>

              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3 }}
                onClick={() => navigate(`/patient/book-appointment?doctorId=${selectedDoctor._id}`)}
              >
                Book Appointment
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
