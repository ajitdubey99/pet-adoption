/**
 * @fileoverview User dashboard: shows own adoption applications in a table.
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../../api/services.js";
import { Alert, Spinner, Pagination, StatusBadge, EmptyState } from "../../components/common/index.jsx";

/**
 * UserDashboard lists the current user's adoption applications with pagination.
 *
 * @returns {JSX.Element}
 */
const UserDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    getMyApplications({ page, limit: 10 })
      .then((res) => { setApplications(res.data || []); setMeta(res.meta); })
      .catch((err) => setError(err.response?.data?.message || "Failed to load."))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title mb-0">My Applications</h1>
        <Link to="/pets" className="btn btn-primary btn-sm">Browse Pets</Link>
      </div>

      {error && <Alert type="error" message={error} />}

      {loading ? (
        <Spinner />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Browse available pets and apply to adopt one."
          action={<Link to="/pets" className="btn btn-primary">Browse Pets</Link>}
        />
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Pet", "Species", "Status", "Applied On", "Admin Note"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <Link to={`/pets/${app.pet?._id}`} className="text-primary-700 hover:underline">
                          {app.pet?.name || "N/A"}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-500 capitalize">{app.pet?.species || "N/A"}</td>
                      <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                      <td className="px-4 py-3 text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-gray-400 italic text-xs">{app.adminNote || "-"}</td>
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

export default UserDashboard;
