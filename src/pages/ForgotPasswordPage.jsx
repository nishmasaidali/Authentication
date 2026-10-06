import { useState } from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import {
  validateEmail,
  validatePassword
} from "../utils/validation";

function ForgotPasswordPage() {
  const { changePassword } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const [message, setMessage] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

    let error = "";

    if (name === "email") {
      error = validateEmail(value);
    }

    if (name === "password") {
      error = validatePassword(value);
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const emailError =
      validateEmail(form.email);

    const passwordError =
      validatePassword(form.password);

    setErrors({
      email: emailError,
      password: passwordError
    });

    if (emailError || passwordError) {
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await changePassword(
        form.email,
        form.password
      );

      setMessage(
        "Password reset successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setMessage(
        "Email not found."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Forgot Password</h1>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={
                form.email === ""
                  ? ""
                  : errors.email
                  ? "invalid"
                  : "valid"
              }
            />

            {errors.email && (
              <p className="error">
                {errors.email}
              </p>
            )}

          </div>

          <div className="form-group">

            <label>New Password</label>

            <div className="password-box">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={form.password}
                onChange={handleChange}
                className={
                  form.password === ""
                    ? ""
                    : errors.password
                    ? "invalid"
                    : "valid"
                }
              />

              <button
                type="button"
                className="show-password"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

            {errors.password && (
              <p className="error">
                {errors.password}
              </p>
            )}

          </div>

          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Resetting..."
              : "Reset Password"}
          </button>

          {message && (
            <p className="success">
              {message}
            </p>
          )}

          <p>
            <Link to="/login">
              Back to Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;