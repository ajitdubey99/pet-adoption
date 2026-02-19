/**
 * @fileoverview Pet detail page with full info and adoption application form.
 */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPetById, submitApplication } from "../api/services.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Alert, Spinner, StatusBadge } from "../components/common/index.jsx";

/**
 * PetDetailPage shows full pet details and an adoption form for eligible users.
 *
 * @returns {JSX.Element}
 */
const PetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({ message: "", livingArrangement: "", hasOtherPets: false, otherPetsDescription: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    getPetById(id)
      .then((res) => setPet(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load pet."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate("/login"); return; }
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitApplication(id, form);
      setSubmitSuccess("Application submitted successfully! We will be in touch.");
      setForm({ message: "", livingArrangement: "", hasOtherPets: false, otherPetsDescription: "" });
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to submit.");
    } finally { setSubmitting(false); }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="max-w-4xl mx-auto px-4 py-8"><Alert type="error" message={error} /></div>;
  if (!pet) return null;

  const ageDisplay = pet.age < 12
    ? `${pet.age} month${pet.age !== 1 ? "s" : ""}`
    : `${Math.floor(pet.age / 12)} year${Math.floor(pet.age / 12) !== 1 ? "s" : ""}`;

  const infoRows = [
    ["Species", pet.species], ["Breed", pet.breed], ["Age", ageDisplay],
    ["Gender", pet.gender], ["Size", pet.size],
    ["Vaccinated", pet.vaccinated ? "Yes" : "No"],
    ["Neutered", pet.neutered ? "Yes" : "No"],
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Photo */}
        <div className="relative rounded-2xl overflow-hidden bg-primary-50 h-80 md:h-auto">
          {pet.photoUrl ? (
            <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary-200 text-8xl font-bold">
              {pet.name[0]}
            </div>
          )}
          <div className="absolute top-3 right-3">
            <StatusBadge status={pet.status} />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {infoRows.map(([label, value]) => (
                  <tr key={label} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-2.5 font-semibold text-gray-500 w-32 capitalize">{label}</td>
                    <td className="px-4 py-2.5 text-gray-800 capitalize">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 leading-relaxed">{pet.description}</p>
        </div>
      </div>

      {/* Application Form */}
      {pet.status === "available" && !isAdmin && (
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Apply to Adopt {pet.name}</h2>

          {submitSuccess && <Alert type="success" message={submitSuccess} />}
          {submitError && <Alert type="error" message={submitError} onDismiss={() => setSubmitError(null)} />}

          {!submitSuccess && (
            <form onSubmit={handleApply} className="flex flex-col gap-4">
              <div className="form-group">
                <label className="label">Why do you want to adopt {pet.name}?</label>
                <textarea
                  rows={4} required maxLength={1000}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="input resize-none"
                />
              </div>

              <div className="form-group">
                <label className="label">Describe your living arrangement</label>
                <textarea
                  rows={3} required maxLength={500}
                  value={form.livingArrangement}
                  onChange={(e) => setForm({ ...form, livingArrangement: e.target.value })}
                  placeholder="House/apartment, garden, nearby parks..."
                  className="input resize-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.hasOtherPets}
                  onChange={(e) => setForm({ ...form, hasOtherPets: e.target.checked })}
                  className="w-4 h-4 rounded text-primary-600"
                />
                <span className="text-sm text-gray-700 font-medium">I have other pets at home</span>
              </label>

              {form.hasOtherPets && (
                <div className="form-group">
                  <label className="label">Tell us about your other pets</label>
                  <textarea
                    rows={2} maxLength={300}
                    value={form.otherPetsDescription}
                    onChange={(e) => setForm({ ...form, otherPetsDescription: e.target.value })}
                    className="input resize-none"
                  />
                </div>
              )}

              {!isAuthenticated ? (
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  Please <a href="/login" className="font-bold underline">log in</a> to submit an application.
                </p>
              ) : (
                <button type="submit" disabled={submitting} className="btn btn-primary btn-lg self-start">
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default PetDetailPage;
