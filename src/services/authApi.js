import axios from "axios";

const API = "http://localhost:3000/users";

export async function loginUser(email, password) {
  const response = await axios.get(API, {
    params: {
      email: email
    }
  });

  const user = response.data[0];

  if (!user || user.password !== password) {
    throw new Error("Invalid email or password");
  }

  return user;
}

export async function registerUser(userData) {
  const response = await axios.post(API, userData);

  return response.data;
}

export async function getUserById(id) {
  const response = await axios.get(`${API}/${id}`);

  return response.data;
}

export async function checkUsername(username) {
  const response = await axios.get(API, {
    params: {
      username: username
    }
  });

  return response.data.length > 0;
}

export async function updateUser(id, data) {
  const response = await axios.patch(`${API}/${id}`, data);

  return response.data;
}

export async function resetPassword(email, newPassword) {
  const response = await axios.get(API, {
    params: {
      email: email
    }
  });

  const user = response.data[0];

  if (!user) {
    throw new Error("Email not found");
  }

  const updatedUser = await axios.patch(`${API}/${user.id}`, {
    password: newPassword
  });

  return updatedUser.data;
}