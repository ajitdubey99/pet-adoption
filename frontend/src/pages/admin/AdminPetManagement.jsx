/**
 * @fileoverview Admin pet management page: full CRUD with inline form panel.
 */

import React, { useState, useEffect } from "react";
import { getPets, createPet, updatePet, deletePet } from "../../api/services.js";
import { Alert, Spinner, Pagination, StatusBadge, EmptyState } from "../../components/common/index.jsx";

const INITIAL_FORM = { name: "", species: "dog", breed: "", age: "", gender: "male", description: "", size: "medium", vaccinated: false, neutered: false };

/**
 * AdminPetManagement provides full pet CRUD with an inline slide-down form.
 *
 * @returns {JSX.Element}
 */
const AdminPetManagement = () => {
  const [pets, setPets] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [page, setPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await getPets({ status: "all", page, limit: 10 });
      setPets(res.data || []); setMeta(res.meta);
    } catch (err) { setError(err.response?.data?.message || "Failed to load."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPets(); }, [page]);

  const openCreate = () => { setEditingPet(null); setForm(INITIAL_FORM); setPhotoFile(null); setFormError(null); setShowForm(true); };

  const openEdit = (pet) => {
    setEditingPet(pet);
    setForm({ name: pet.name, species: pet.species, breed: pet.breed, age: pet.age, gender: pet.gender, description: pet.description, size: pet.size, vaccinated: pet.vaccinated, neutered: pet.neutered });
    setPhotoFile(null); setFormError(null); setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true); setFormError(null);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photoFile) fd.append("photo", photoFile);
      editingPet ? await updatePet(editingPet._id, fd) : await createPet(fd);
      setSuccess(editingPet ? "Pet updated." : "Pet created.");
      setShowForm(false); fetchPets();
    } catch (err) { setFormError(err.response?.data?.message || "Save failed."); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try { await deletePet(id); setSuccess(`${name} deleted.`); fetchPets(); }
    catch (err) { setError(err.response?.data?.message || "Delete failed."); }
  };

  const selectClass = "input";
  const checkboxRow = (id, label) => (
    <label key={id} className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={form[id]} onChange={(e) => setForm({ ...form, [id]: e.target.checked })} className="w-4 h-4 rounded text-primary-600" />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title mb-0">Manage Pets</h1>
        <button onClick={openCreate} className="btn btn-primary">Add New Pet</button>
      </div>

      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}
      {success && <Alert type="success" message={success} onDismiss={() => setSuccess(null)} />}

      {/* Inline Form Panel */}
      {showForm && (
        <div className="card p-6 mb-6 border-l-4 border-primary-600">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{editingPet ? "Edit Pet" : "Add New Pet"}</h2>
          {formError && <Alert type="error" message={formError} />}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["name", "Name", "text", "Buddy"],
              ["breed", "Breed", "text", "Golden Retriever"],
            ].map(([id, label, type, ph]) => (
              <div key={id} className="form-group">
                <label className="label">{label}</label>
                <input type={type} required value={form[id]} placeholder={ph} onChange={(e) => setForm({ ...form, [id]: e.target.value })} className="input" />
              </div>
            ))}

            <div className="form-group">
              <label className="label">Species</label>
              <select value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })} className={selectClass}>
                {["dog","cat","bird","rabbit","other"].map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="label">Age (months)</label>
              <input type="number" required min="0" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="input" />
            </div>

            <div className="form-group">
              <label className="label">Gender</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className={selectClass}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label">Size</label>
              <select value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className={selectClass}>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <div className="form-group md:col-span-2">
              <label className="label">Description</label>
              <textarea rows={3} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input resize-none" />
            </div>

            <div className="flex gap-6 md:col-span-2">
              {checkboxRow("vaccinated", "Vaccinated")}
              {checkboxRow("neutered", "Neutered")}
            </div>

            <div className="form-group md:col-span-2">
              <label className="label">Photo (optional)</label>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setPhotoFile(e.target.files[0])} className="input" />
            </div>

            <div className="flex gap-3 md:col-span-2">
              <button type="submit" disabled={submitting} className="btn btn-primary">
                {submitting ? "Saving..." : editingPet ? "Update Pet" : "Create Pet"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <Spinner /> : pets.length === 0 ? (
        <EmptyState title="No pets yet" description="Add your first pet listing." />
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Name","Species","Breed","Age (mo)","Status","Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pets.map((pet) => (
                    <tr key={pet._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{pet.name}</td>
                      <td className="px-4 py-3 text-gray-500 capitalize">{pet.species}</td>
                      <td className="px-4 py-3 text-gray-500">{pet.breed}</td>
                      <td className="px-4 py-3 text-gray-500">{pet.age}</td>
                      <td className="px-4 py-3"><StatusBadge status={pet.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(pet)} className="btn btn-secondary btn-sm">Edit</button>
                          <button onClick={() => handleDelete(pet._id, pet.name)} className="btn btn-danger btn-sm">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination meta={meta} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default AdminPetManagement;
