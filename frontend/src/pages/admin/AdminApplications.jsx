/**
 * @fileoverview Admin applications management page.
 * Filterable list of all adoption applications with inline review panel.
 */

import React, { useState, useEffect } from "react";
import { getAllApplications, reviewApplication } from "../../api/services.js";
import { Alert, Spinner, Pagination, StatusBadge, EmptyState } from "../../components/common/index.jsx";

/**
 * AdminApplications lets admins view, filter, and review adoption applications.
 *
 * @returns {JSX.Element}
 */
const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [page, setPage] = useState(1);

  const [reviewingId, setReviewingId] = useState(null);
  const [reviewNote, setReviewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await getAllApplications({ status: statusFilter || undefined, page, limit: 10 });
      setApplications(res.data || []); setMeta(res.meta);
    } catch (err) { setError(err.response?.data?.message || "Failed to load."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApplications(); }, [statusFilter, page]);

  /**
   * Submits an approve/reject decision to the backend.
   *
   * @async
   * @param {string} appId - Application MongoDB ObjectId.
   * @param {"approved"|"rejected"} decision
   */
  const handleReview = async (appId, decision) => {
    setSubmitting(true);
    try {
      await reviewApplication(appId, { status: decision, adminNote: reviewNote });
      setSuccess(`Application ${decision}.`);
      setReviewingId(null);
      fetchApplications();
    } catch (err) { setError(err.response?.data?.message || "Review failed."); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="page-title">Adoption Applications</h1>

      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}
      {success && <Alert type="success" message={success} onDismiss={() => setSuccess(null)} />}

      {/* Filter */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-gray-600 font-medium">Filter:</span>
        {["pending","approved","rejected",""].map((s) => (
          <button
            key={s || "all"}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`btn btn-sm ${statusFilter === s ? "btn-primary" : "btn-secondary"}`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : applications.length === 0 ? (
        <EmptyState title="No applications found" description="Try a different filter." />
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Pet","Applicant","Applied On","Status","Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {applications.map((app) => (
                    <React.Fragment key={app._id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          <div>{app.pet?.name || "N/A"}</div>
                          <div className="text-xs text-gray-400 capitalize">{app.pet?.species}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{app.applicant?.name}</div>
                          <div className="text-xs text-gray-400">{app.applicant?.email}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                        <td className="px-4 py-3">
                          {app.status === "pending" && (
                            <button
                              onClick={() => { setReviewingId(reviewingId === app._id ? null : app._id); setReviewNote(""); }}
                              className="btn btn-secondary btn-sm"
                            >
                              {reviewingId === app._id ? "Close" : "Review"}
                            </button>
                          )}
                          {app.adminNote && app.status !== "pending" && (
                            <span className="text-xs text-gray-400 italic" title={app.adminNote}>Note on file</span>
                          )}
                        </td>
                      </tr>

                      {/* Inline Review Panel */}
                      {reviewingId === app._id && (
                        <tr>
                          <td colSpan={5} className="bg-primary-50 border-b border-primary-100">
                            <div className="p-4 max-w-2xl">
                              <h4 className="font-bold text-gray-800 mb-3">Application Details</h4>
                              <div className="space-y-2 mb-4">
                                <div className="bg-white rounded-lg p-3 text-sm">
                                  <span className="font-semibold text-gray-600">Message: </span>
                                  <span className="text-gray-700">{app.message}</span>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-sm">
                                  <span className="font-semibold text-gray-600">Living Arrangement: </span>
                                  <span className="text-gray-700">{app.livingArrangement}</span>
                                </div>
                                {app.hasOtherPets && (
                                  <div className="bg-white rounded-lg p-3 text-sm">
                                    <span className="font-semibold text-gray-600">Other Pets: </span>
                                    <span className="text-gray-700">{app.otherPetsDescription}</span>
                                  </div>
                                )}
                              </div>

                              <div className="form-group mb-3">
                                <label className="label">Admin Note (optional)</label>
                                <textarea
                                  rows={2} maxLength={500}
                                  value={reviewNote}
                                  onChange={(e) => setReviewNote(e.target.value)}
                                  placeholder="Add a note for the applicant..."
                                  className="input resize-none"
                                />
                              </div>

                              <div className="flex gap-3">
                                <button onClick={() => handleReview(app._id, "approved")} disabled={submitting} className="btn btn-primary">
                                  Approve
                                </button>
                                <button onClick={() => handleReview(app._id, "rejected")} disabled={submitting} className="btn btn-danger">
                                  Reject
                                </button>
                                <button onClick={() => setReviewingId(null)} className="btn btn-secondary">Cancel</button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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

export default AdminApplications;
