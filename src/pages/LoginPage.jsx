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

function LoginPage() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(true);

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

    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(
      form.password
    );

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
      await login(
        form.email,
        form.password,
        rememberMe
      );

      navigate("/dashboard");
    } catch (error) {
      setMessage("Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Login</h1>

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
                  setShowPassword(!showPassword)
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

          <label className="checkbox">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) =>
                setRememberMe(e.target.checked)
              }
            />

            Remember me
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Logging in..."
              : "Login"}
          </button>

          {message && (
            <p className="error">
              {message}
            </p>
          )}

          <p>
            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </p>

          <p>
            Don't have an account?{" "}
            <Link to="/register">
              Register
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default LoginPage;