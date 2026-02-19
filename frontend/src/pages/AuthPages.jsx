/**
 * @fileoverview Login and Register pages using Tailwind CSS.
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Alert } from "../components/common/index.jsx";

// -----------------------------------------------------------------------
// LoginPage
// -----------------------------------------------------------------------

/**
 * LoginPage handles user authentication and redirects on success.
 *
 * @returns {JSX.Element}
 */
export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const user = await login(form);
      navigate(user.role === "admin" ? "/admin/pets" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
          </div>

          {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-group">
              <label className="label">Email Address</label>
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com" className="input" />
            </div>

            <div className="form-group">
              <label className="label">Password</label>
              <input type="password" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password" className="input" />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full justify-center mt-2">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Do not have an account?{" "}
            <Link to="/register" className="text-primary-700 font-semibold hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------
// RegisterPage
// -----------------------------------------------------------------------

/**
 * RegisterPage creates a new user account and logs them in.
 *
 * @returns {JSX.Element}
 */
export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally { setLoading(false); }
  };

  const fields = [
    { id: "name", label: "Full Name", type: "text", placeholder: "Jane Smith", required: true },
    { id: "email", label: "Email Address", type: "email", placeholder: "you@example.com", required: true },
    { id: "password", label: "Password", type: "password", placeholder: "At least 6 characters", required: true, minLength: 6 },
    { id: "phone", label: "Phone (optional)", type: "tel", placeholder: "+1 555 000 0000" },
    { id: "address", label: "Address (optional)", type: "text", placeholder: "123 Main St, City" },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
            <p className="text-gray-500 text-sm mt-1">Join Pet Adoption today</p>
          </div>

          {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {fields.map(({ id, label, type, placeholder, required, minLength }) => (
              <div key={id} className="form-group">
                <label className="label">{label}</label>
                <input
                  type={type}
                  required={required}
                  minLength={minLength}
                  value={form[id]}
                  placeholder={placeholder}
                  onChange={(e) => setForm({ ...form, [id]: e.target.value })}
                  className="input"
                />
              </div>
            ))}

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full justify-center mt-2">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-700 font-semibold hover:underline">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
