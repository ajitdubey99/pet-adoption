/**
 * @fileoverview Root application component.
 * Configures React Router v6 and wraps the tree with AuthProvider.
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { PrivateRoute } from "./components/common/index.jsx";
import Navbar from "./components/layout/Navbar.jsx";

import PetListPage from "./pages/PetListPage.jsx";
import PetDetailPage from "./pages/PetDetailPage.jsx";
import { LoginPage, RegisterPage } from "./pages/AuthPages.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import AdminPetManagement from "./pages/admin/AdminPetManagement.jsx";
import AdminApplications from "./pages/admin/AdminApplications.jsx";

/**
 * App defines the full route map:
 *   Public  : /pets, /pets/:id, /login, /register
 *   User    : /dashboard
 *   Admin   : /admin/pets, /admin/applications
 *
 * @returns {JSX.Element}
 */
const App = () => (
  <AuthProvider>
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/pets" replace />} />
            <Route path="/pets" element={<PetListPage />} />
            <Route path="/pets/:id" element={<PetDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/dashboard" element={
              <PrivateRoute><UserDashboard /></PrivateRoute>
            } />

            <Route path="/admin/pets" element={
              <PrivateRoute role="admin"><AdminPetManagement /></PrivateRoute>
            } />

            <Route path="/admin/applications" element={
              <PrivateRoute role="admin"><AdminApplications /></PrivateRoute>
            } />

            <Route path="*" element={
              <div className="max-w-5xl mx-auto px-4 py-16 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">404 - Page Not Found</h2>
                <a href="/pets" className="btn btn-primary">Back to Pets</a>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  </AuthProvider>
);

export default App;
