/**
 * @fileoverview Shared UI components: Alert, Spinner, Pagination, PetCard, PrivateRoute.
 */

import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// -----------------------------------------------------------------------
// PrivateRoute
// -----------------------------------------------------------------------

/**
 * Redirects unauthenticated users to /login.
 * Optionally restricts to a specific role.
 *
 * @param {{ children: React.ReactNode, role?: string }} props
 */
export const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return children;
};

// -----------------------------------------------------------------------
// Alert
// -----------------------------------------------------------------------

/**
 * Dismissible alert banner.
 *
 * @param {{ type: 'success'|'error'|'info'|'warning', message: string, onDismiss?: Function }} props
 */
export const Alert = ({ type = "info", message, onDismiss }) => {
  if (!message) return null;

  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error:   "bg-red-50 border-red-200 text-red-800",
    info:    "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  };

  return (
    <div className={`flex justify-between items-start gap-3 p-4 rounded-lg border text-sm ${styles[type]} mb-4`}>
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="font-bold opacity-60 hover:opacity-100 shrink-0">
          X
        </button>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------
// Spinner
// -----------------------------------------------------------------------

/**
 * Centered loading spinner.
 *
 * @param {{ size?: string }} props
 */
export const Spinner = ({ size = "lg" }) => {
  const sizes = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-500">
      <div className={`${sizes[size]} border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin`}></div>
      <p className="text-sm">Loading...</p>
    </div>
  );
};

// -----------------------------------------------------------------------
// Pagination
// -----------------------------------------------------------------------

/**
 * Pagination controls. Returns null if only one page.
 *
 * @param {{ meta: Object, onPageChange: Function }} props
 */
export const Pagination = ({ meta, onPageChange }) => {
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
      <button
        disabled={!meta.hasPrevPage}
        onClick={() => onPageChange(meta.page - 1)}
        className="btn btn-secondary btn-sm disabled:opacity-40"
      >
        Previous
      </button>

      {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`btn btn-sm ${p === meta.page ? "bg-primary-700 text-white" : "btn-secondary"}`}
        >
          {p}
        </button>
      ))}

      <button
        disabled={!meta.hasNextPage}
        onClick={() => onPageChange(meta.page + 1)}
        className="btn btn-secondary btn-sm disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

// -----------------------------------------------------------------------
// PetCard
// -----------------------------------------------------------------------

/**
 * Card for displaying a pet in the browse grid.
 *
 * @param {{ pet: Object }} props
 */
export const PetCard = ({ pet }) => {
  const ageDisplay =
    pet.age < 12
      ? `${pet.age} mo`
      : `${Math.floor(pet.age / 12)} yr${Math.floor(pet.age / 12) !== 1 ? "s" : ""}`;

  const photo = pet.photoUrl ? pet.photoUrl : null;

  return (
    <div className="card overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
      <div className="relative h-48 bg-primary-50">
        {photo ? (
          <img src={photo} alt={pet.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary-300 text-5xl font-bold">
            {pet.name[0]}
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`badge-${pet.status}`}>{pet.status}</span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-gray-900 text-lg">{pet.name}</h3>
        <p className="text-gray-500 text-sm capitalize">{pet.species} &bull; {pet.breed}</p>
        <p className="text-gray-400 text-xs">{ageDisplay} &bull; {pet.gender} &bull; {pet.size}</p>
        <div className="mt-auto pt-2">
          <Link
            to={`/pets/${pet._id}`}
            className="btn btn-primary btn-sm w-full justify-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------
// EmptyState
// -----------------------------------------------------------------------

/**
 * Empty state placeholder with optional action.
 *
 * @param {{ title: string, description?: string, action?: React.ReactNode }} props
 */
export const EmptyState = ({ title, description, action }) => (
  <div className="text-center py-16 px-4">
    <div className="text-6xl mb-4">?</div>
    <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
    {description && <p className="text-gray-400 text-sm mb-4">{description}</p>}
    {action}
  </div>
);

// -----------------------------------------------------------------------
// StatusBadge
// -----------------------------------------------------------------------

/**
 * Inline status badge for tables.
 *
 * @param {{ status: string }} props
 */
export const StatusBadge = ({ status }) => (
  <span className={`badge-${status}`}>{status}</span>
);
