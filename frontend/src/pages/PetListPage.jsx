/**
 * @fileoverview Public pet listing page with search, filters, and pagination.
 */

import React, { useState, useEffect, useCallback } from "react";
import { getPets } from "../api/services.js";
import { PetCard, Pagination, Alert, Spinner, EmptyState } from "../components/common/index.jsx";

/**
 * PetListPage renders a searchable, filterable grid of pets with pagination.
 *
 * @returns {JSX.Element}
 */
const PetListPage = () => {
  const [pets, setPets] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  const [filters, setFilters] = useState({
    search: "", species: "", status: "available",
    minAge: "", maxAge: "", page: 1, limit: 12,
  });

  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ""));
    try {
      const res = await getPets(params);
      setPets(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load pets.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchPets(); }, [fetchPets]);

  const handleFilterChange = (field, value) =>
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your New Best Friend</h1>
        <p className="text-gray-500">Browse pets looking for a loving home.</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name or breed..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="input flex-1"
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
        <select
          value={filters.species}
          onChange={(e) => handleFilterChange("species", e.target.value)}
          className="input w-40"
        >
          <option value="">All Species</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="bird">Bird</option>
          <option value="rabbit">Rabbit</option>
          <option value="other">Other</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="input w-36"
        >
          <option value="available">Available</option>
          <option value="pending">Pending</option>
          <option value="all">All</option>
        </select>

        <input
          type="number"
          placeholder="Min age (mo)"
          value={filters.minAge}
          min="0"
          onChange={(e) => handleFilterChange("minAge", e.target.value)}
          className="input w-36"
        />
        <input
          type="number"
          placeholder="Max age (mo)"
          value={filters.maxAge}
          min="0"
          onChange={(e) => handleFilterChange("maxAge", e.target.value)}
          className="input w-36"
        />

        {(filters.search || filters.species || filters.minAge || filters.maxAge) && (
          <button
            onClick={() => { setSearchInput(""); setFilters({ search: "", species: "", status: "available", minAge: "", maxAge: "", page: 1, limit: 12 }); }}
            className="btn btn-secondary btn-sm"
          >
            Clear Filters
          </button>
        )}
      </div>

      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}

      {loading ? (
        <Spinner />
      ) : pets.length === 0 ? (
        <EmptyState
          title="No pets found"
          description="Try adjusting your search filters."
        />
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Showing {pets.length} of {meta?.total || 0} pets
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pets.map((pet) => <PetCard key={pet._id} pet={pet} />)}
          </div>
          <Pagination meta={meta} onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))} />
        </>
      )}
    </div>
  );
};

export default PetListPage;
