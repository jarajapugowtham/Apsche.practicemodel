import axios from "axios";

/* =========================================================
   API BASE URL
========================================================= */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

/* =========================================================
   AXIOS INSTANCE
========================================================= */

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================================================
   REQUEST INTERCEPTOR
   Automatically attaches JWT token
========================================================= */

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "apsche_token"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) =>
    Promise.reject(error)
);

/* =========================================================
   RESPONSE INTERCEPTOR
========================================================= */

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401
    ) {
      localStorage.removeItem(
        "apsche_token"
      );

      localStorage.removeItem(
        "apsche_user"
      );
    }

    return Promise.reject(error);
  }
);

/* =========================================================
   AUTH API
========================================================= */

export const authAPI = {
  register: (data) =>
    api.post(
      "/auth/register",
      data
    ),

  login: (data) =>
    api.post(
      "/auth/login",
      data
    ),

  me: () =>
    api.get("/auth/me"),
};

/* =========================================================
   COLLEGE API
========================================================= */

export const collegeAPI = {
  getAll: (params = {}) =>
    api.get(
      "/colleges",
      {
        params,
      }
    ),

  getById: (id) =>
    api.get(
      `/colleges/${id}`
    ),

  getDistricts: () =>
    api.get(
      "/colleges/districts/list"
    ),

  getBranches: () =>
    api.get(
      "/colleges/branches/list"
    ),

  getCutoffs: (
    id,
    params = {}
  ) =>
    api.get(
      `/colleges/${id}/cutoffs`,
      {
        params,
      }
    ),

  getFees: (
    id,
    params = {}
  ) =>
    api.get(
      `/colleges/${id}/fees`,
      {
        params,
      }
    ),
};

/* =========================================================
   APPLICATION API
========================================================= */

export const applicationAPI = {
  create: (data) =>
    api.post(
      "/applications",
      data
    ),

  getMine: (params = {}) =>
    api.get(
      "/applications/me",
      {
        params,
      }
    ),

  updateDetails: (
    id,
    data
  ) =>
    api.patch(
      `/applications/${id}/details`,
      data
    ),

  savePreferences: (
    id,
    preferences
  ) =>
    api.patch(
      `/applications/${id}/preferences`,
      {
        preferences,
      }
    ),

  lockPreferences: (id) =>
    api.patch(
      `/applications/${id}/lock`
    ),

  submit: (id) =>
    api.patch(
      `/applications/${id}/submit`
    ),
};

/* =========================================================
   ADMIN API
========================================================= */

export const adminAPI = {
  dashboard: () =>
    api.get(
      "/admin/dashboard"
    ),

  applications: (
    params = {}
  ) =>
    api.get(
      "/admin/applications",
      {
        params,
      }
    ),

  applicationById: (id) =>
    api.get(
      `/admin/applications/${id}`
    ),

  reviewApplication: (
    id,
    data
  ) =>
    api.patch(
      `/admin/applications/${id}/review`,
      data
    ),

  allotSeat: (
    id,
    data
  ) =>
    api.patch(
      `/admin/applications/${id}/allot`,
      data
    ),

  verifyCollege: (id) =>
    api.patch(
      `/admin/colleges/${id}/verify`
    ),
};

/* =========================================================
   HEALTH CHECK
========================================================= */

export const healthAPI = {
  check: () =>
    api.get("/health"),
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default api;
