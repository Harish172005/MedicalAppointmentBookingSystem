import React from 'react';
import { Card, CardContent, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { FaCalendarCheck, FaUserEdit, FaClock } from "react-icons/fa";

export default function DoctorDashboard() {
  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Doctor Dashboard</h2>
      <div className="row g-4 justify-content-center">
        <div className="col-md-4">
          <Link to="/doctor/view-appointments" className="text-decoration-none text-dark">
            <Card className="h-100 shadow-sm border-primary" sx={{ transition: "0.3s", '&:hover': { transform: "scale(1.03)" } }}>
              <CardContent className="text-center">
                <FaCalendarCheck size={40} className="mb-3" />
                <h5>View Appointments</h5>
              </CardContent>
            </Card>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/doctor/manage-availability" className="text-decoration-none text-dark">
            <Card className="h-100 shadow-sm border-success" sx={{ transition: "0.3s", '&:hover': { transform: "scale(1.03)" } }}>
              <CardContent className="text-center">
                <FaClock size={40} className="mb-3" />
                <h5>Manage Availability</h5>
              </CardContent>
            </Card>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/doctor/edit-profile" className="text-decoration-none text-dark">
            <Card className="h-100 shadow-sm border-warning" sx={{ transition: "0.3s", '&:hover': { transform: "scale(1.03)" } }}>
              <CardContent className="text-center">
                <FaUserEdit size={40} className="mb-3" />
                <h5>Edit Profile</h5>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

