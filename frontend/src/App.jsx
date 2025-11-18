// src/App.js
import React from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();

  // Hide sidebar for login & register pages
  const noSidebarRoutes = ["/login", "/register"];
  const hideSidebar = noSidebarRoutes.includes(location.pathname);

  return (
    <div style={{ display: "flex" }}>
      {/* Show sidebar only if logged in and not on login/register */}
      {user && !hideSidebar && <Sidebar />}
      <div style={{ flex: 1 }}>
        <AppRoutes />
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;


