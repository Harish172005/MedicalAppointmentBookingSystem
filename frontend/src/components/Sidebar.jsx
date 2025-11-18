// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { getUser } from '../utils/auth';
import { ListGroup } from 'react-bootstrap';
import { MdDashboard, MdEventAvailable, MdEdit } from 'react-icons/md';
import { FaUserEdit, FaBookMedical } from 'react-icons/fa';

const Sidebar = () => {
  const user = getUser();

  const doctorLinks = [
    { path: '/doctor/dashboard', label: 'Dashboard', icon: <MdDashboard /> },
    { path: '/doctor/view-appointments', label: 'View Appointments', icon: <FaBookMedical /> },
    { path: '/doctor/manage-availability', label: 'Manage Availability', icon: <MdEventAvailable /> },
    { path: '/doctor/edit-profile', label: 'Edit Profile', icon: <FaUserEdit /> }
  ];

  const patientLinks = [
    { path: '/patient/dashboard', label: 'Dashboard', icon: <MdDashboard /> },
    { path: '/patient/book-appointment', label: 'Book Appointment', icon: <FaBookMedical /> },
    { path: '/patient/view-appointments', label: 'View Appointments', icon: <MdEventAvailable /> },
    { path: '/patient/edit-profile', label: 'Edit Profile', icon: <FaUserEdit /> }
  ];

  const linksToShow = user?.role === 'doctor' ? doctorLinks : patientLinks;

  return (
    <div style={{ width: '220px', background: '#f8f9fa', padding: '10px', height: '100vh' }}>
      <h5 style={{ marginBottom: '20px' }}>{user?.role?.toUpperCase()} PANEL</h5>
      <ListGroup>
        {linksToShow.map((link) => (
          <ListGroup.Item
            key={link.path}
            action
            as={Link}
            to={link.path}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {link.icon} {link.label}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Sidebar;

