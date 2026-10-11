import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("devstack_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// H-5: on 401, clear stale auth state and redirect to login.
// Handles token expiry mid-session without leaving the user stuck.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("devstack_token");
      localStorage.removeItem("devstack_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;