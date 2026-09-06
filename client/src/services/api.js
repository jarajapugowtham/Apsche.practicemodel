import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Attach saved login token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("apsche_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle common API errors
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("apsche_token");
      localStorage.removeItem("apsche_user");
    }

    return Promise.reject(error);
  }
);

/* =========================================================
   AUTH
========================================================= */

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const getCurrentUser = () =>
  api.get("/auth/me");

/* =========================================================
   COLLEGES
========================================================= */

export const getColleges = (params = {}) =>
  api.get("/colleges", { params });

export const getCollegeById = (id) =>
  api.get(`/colleges/${id}`);

export const searchColleges = (query) =>
  api.get("/colleges/search", {
    params: { q: query },
});

/* =========================================================
   BRANCHES
========================================================= */

export const getBranches = (params = {}) =>
  api.get("/branches", { params });

export const getCollegeBranches = (collegeId) =>
  api.get(`/colleges/${collegeId}/branches`);

/* =========================================================
   CUTOFFS
========================================================= */

export const getCutoffs = (params = {}) =>
  api.get("/cutoffs", { params });

export const getCollegeCutoffs = (collegeId, params = {}) =>
  api.get(`/colleges/${collegeId}/cutoffs`, {
    params,
  });

/* =========================================================
   FEES
========================================================= */

export const getFees = (params = {}) =>
  api.get("/fees", { params });

export const getCollegeFees = (collegeId) =>
  api.get(`/colleges/${collegeId}/fees`);

/* =========================================================
   COUNSELLING
========================================================= */

export const getCounsellingInfo = () =>
  api.get("/counselling");

export const getCounsellingRounds = () =>
  api.get("/counselling/rounds");

export const getCounsellingSchedule = () =>
  api.get("/counselling/schedule");

/* =========================================================
   APPLICATION
========================================================= */

export const createApplication = (data) =>
  api.post("/applications", data);

export const getMyApplication = () =>
  api.get("/applications/me");

export const updateApplication = (id, data) =>
  api.put(`/applications/${id}`, data);

export const submitApplication = (id) =>
  api.post(`/applications/${id}/submit`);

/* =========================================================
   PREFERENCES
========================================================= */

export const getPreferences = () =>
  api.get("/preferences");

export const savePreferences = (data) =>
  api.post("/preferences", data);

export const updatePreference = (id, data) =>
  api.put(`/preferences/${id}`, data);

export const deletePreference = (id) =>
  api.delete(`/preferences/${id}`);

/* =========================================================
   FAVORITES
========================================================= */

export const getFavorites = () =>
  api.get("/favorites");

export const addFavorite = (collegeId) =>
  api.post("/favorites", { collegeId });

export const removeFavorite = (collegeId) =>
  api.delete(`/favorites/${collegeId}`);

/* =========================================================
   COMPARISON
========================================================= */

export const compareColleges = (collegeIds) =>
  api.post("/compare", {
    collegeIds,
  });

/* =========================================================
   DASHBOARD
========================================================= */

export const getDashboardStats = () =>
  api.get("/dashboard/stats");

/* =========================================================
   HEALTH CHECK
========================================================= */

export const checkServer = () =>
  api.get("/health");

export default api;
