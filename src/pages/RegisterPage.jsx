import { useState, useEffect } from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateFullName
} from "../utils/validation";

function RegisterPage() {
  const {
    register,
    checkUsername
  } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: ""
  });

  const [errors, setErrors] = useState({});

  const [usernameStatus, setUsernameStatus] =
    useState("");

  const [isCheckingUsername, setIsCheckingUsername] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    const username = form.username;

    const basicError =
      validateUsername(username);

    if (basicError || !username.trim()) {
      setUsernameStatus("");
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingUsername(true);

      try {
        const exists =
          await checkUsername(username);

        if (exists) {
          setUsernameStatus("exists");

          setErrors((prev) => ({
            ...prev,
            username:
              "Username already exists"
          }));
        } else {
          setUsernameStatus("available");

          setErrors((prev) => ({
            ...prev,
            username: ""
          }));
        }
      } catch (error) {
        setUsernameStatus("");
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.username]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

    let error = "";

    if (name === "username") {
      error = validateUsername(value);
    }

    if (name === "email") {
      error = validateEmail(value);
    }

    if (name === "password") {
      error = validatePassword(value);
    }

    if (name === "fullName") {
      error = validateFullName(value);
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const usernameError =
      validateUsername(form.username);

    const emailError =
      validateEmail(form.email);

    const passwordError =
      validatePassword(form.password);

    const fullNameError =
      validateFullName(form.fullName);

    setErrors({
      username: usernameError,
      email: emailError,
      password: passwordError,
      fullName: fullNameError
    });

    if (
      usernameError ||
      emailError ||
      passwordError ||
      fullNameError
    ) {
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const exists =
        await checkUsername(form.username);

      if (exists) {
        setErrors((prev) => ({
          ...prev,
          username:
            "Username already exists"
        }));

        return;
      }

      await register({
        ...form,
        avatar: "",
        createdAt:
          new Date().toISOString(),
        emailVerified: false
      });

      setMessage(
        "Registration successful! Email verification simulated."
      );

      navigate("/dashboard");
    } catch (error) {
      setMessage("Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Register</h1>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Username</label>

            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className={
                form.username === ""
                  ? ""
                  : errors.username
                  ? "invalid"
                  : usernameStatus ===
                    "available"
                  ? "valid"
                  : ""
              }
            />

            {isCheckingUsername && (
              <p className="info">
                Checking username...
              </p>
            )}

            {usernameStatus ===
              "available" && (
              <p className="success">
                Username available
              </p>
            )}

            {errors.username && (
              <p className="error">
                {errors.username}
              </p>
            )}

          </div>

          <div className="form-group">

            <label>Full Name</label>

            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className={
                form.fullName === ""
                  ? ""
                  : errors.fullName
                  ? "invalid"
                  : "valid"
              }
            />

            {errors.fullName && (
              <p className="error">
                {errors.fullName}
              </p>
            )}

          </div>

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

            <label>Password</label>

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
              ? "Registering..."
              : "Register"}
          </button>

          {message && (
            <p className="success">
              {message}
            </p>
          )}

          <p>
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default RegisterPage;