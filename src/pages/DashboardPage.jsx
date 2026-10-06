import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

function DashboardPage() {
  const {
    user,
    logout,
    updateProfile,
    theme,
    toggleTheme
  } = useAuth();

  const navigate = useNavigate();

  const [avatar, setAvatar] =
    useState(user?.avatar || "");

  const [showAvatarForm, setShowAvatarForm] =
    useState(false);

  const [isUpdating, setIsUpdating] =
    useState(false);

  function handleLogout() {
    logout();

    navigate("/login");
  }

  async function handleAvatarUpdate(e) {
    e.preventDefault();

    setIsUpdating(true);

    try {
      await updateProfile({
        avatar: avatar
      });

      setShowAvatarForm(false);
    } finally {
      setIsUpdating(false);
    }
  }

  if (!user) {
    return (
      <div className="skeleton-container">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-avatar"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      <div className="dashboard-header">

        <h1>Dashboard</h1>

        <button
          onClick={toggleTheme}
          className="theme-button"
        >
          {theme === "light"
            ? "Dark Mode"
            : "Light Mode"}
        </button>

      </div>

      <div className="profile-card">

        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.fullName}
            className="profile-image"
          />
        ) : (
          <div className="profile-placeholder">
            {user.fullName
              ?.charAt(0)
              .toUpperCase()}
          </div>
        )}

        <h2>{user.fullName}</h2>

        <p>
          <strong>Username:</strong>{" "}
          {user.username}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {user.email}
        </p>

        <p>
          <strong>Created At:</strong>{" "}
          {new Date(
            user.createdAt
          ).toLocaleDateString()}
        </p>

        <p>
          <strong>Email Status:</strong>{" "}

          {user.emailVerified
            ? "Verified"
            : "Not Verified"}
        </p>

        <button
          onClick={() =>
            setShowAvatarForm(
              !showAvatarForm
            )
          }
        >
          {showAvatarForm
            ? "Cancel"
            : "Change Profile Picture"}
        </button>

        {showAvatarForm && (
          <form
            onSubmit={handleAvatarUpdate}
            className="avatar-form"
          >

            <label>
              Profile Picture URL
            </label>

            <input
              type="url"
              value={avatar}
              onChange={(e) =>
                setAvatar(e.target.value)
              }
              placeholder="https://..."
            />

            <button
              type="submit"
              disabled={isUpdating}
            >
              {isUpdating
                ? "Updating..."
                : "Update Picture"}
            </button>

          </form>
        )}

        <button
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default DashboardPage;