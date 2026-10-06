import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  loginUser,
  registerUser,
  getUserById,
  checkUsername,
  updateUser,
  resetPassword
} from "../services/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    document.body.className = theme;

    localStorage.setItem("theme", theme);
  }, [theme]);

  function showToast(message, type = "success") {
    setToast({
      message,
      type
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  function toggleTheme() {
    setTheme((prev) =>
      prev === "light" ? "dark" : "light"
    );
  }

  async function login(email, password, rememberMe = true) {
    const loggedUser = await loginUser(email, password);

    if (rememberMe) {
      localStorage.setItem("userId", loggedUser.id);
      sessionStorage.removeItem("userId");
    } else {
      sessionStorage.setItem("userId", loggedUser.id);
      localStorage.removeItem("userId");
    }

    setUser(loggedUser);

    showToast("Login successful");
  }

  async function register(userData) {
    const newUser = await registerUser(userData);

    localStorage.setItem("userId", newUser.id);
    sessionStorage.removeItem("userId");

    setUser(newUser);

    showToast("Registration successful");
  }

  function logout() {
    localStorage.removeItem("userId");
    sessionStorage.removeItem("userId");

    setUser(null);

    showToast("Logged out successfully");
  }

  function isAuthenticated() {
    return user !== null;
  }

  async function fetchCurrentUser() {
    const userId =
      localStorage.getItem("userId") ||
      sessionStorage.getItem("userId");

    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await getUserById(userId);

      setUser(currentUser);
    } catch (error) {
      localStorage.removeItem("userId");
      sessionStorage.removeItem("userId");

      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function usernameExists(username) {
    return await checkUsername(username);
  }

  async function updateProfile(data) {
    if (!user) return;

    const updatedUser = await updateUser(user.id, data);

    setUser(updatedUser);

    showToast("Profile updated successfully");
  }

  async function changePassword(email, newPassword) {
    const updatedUser = await resetPassword(
      email,
      newPassword
    );

    showToast("Password reset successfully");

    return updatedUser;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated,
        fetchCurrentUser,
        checkUsername: usernameExists,
        updateProfile,
        changePassword,
        theme,
        toggleTheme,
        toast,
        showToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}