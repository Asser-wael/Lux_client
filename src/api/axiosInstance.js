import axios from "axios";
import { store } from "../app/store";
import { setAccessToken, logout, logoutUser } from "../features/auth/authSlice";

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

/* =========================================================
   REQUEST INTERCEPTOR
========================================================= */

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================================================
   RESPONSE INTERCEPTOR
========================================================= */

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    /*
     * No response = network/CORS/etc.
     */
    if (!error.response) {
      return Promise.reject(error);
    }

    /*
     * Only refresh when:
     *
     * 401
     * TOKEN_EXPIRED
     * request wasn't retried before
     */
    if (
      error.response.status === 401 &&
      error.response.data?.code === "TOKEN_EXPIRED" &&
      !originalRequest?._retry
    ) {
      originalRequest._retry = true;

      try {
        /*
         * IMPORTANT:
         * Use plain axios here, NOT axiosInstance.
         *
         * This prevents the refresh request itself
         * from entering this interceptor.
         */
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );

        const newAccessToken =
          response.data.accessToken;

        if (!newAccessToken) {
          throw new Error(
            "Refresh response does not contain accessToken"
          );
        }

        /*
         * Save new access token
         */
        store.dispatch(
          setAccessToken(newAccessToken)
        );

        /*
         * Update original request
         */
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        /*
         * Retry original request
         */
        return axiosInstance(originalRequest);

      } catch (refreshError) {

        console.error(
          "Refresh token failed:",
          refreshError.response?.data ||
            refreshError.message
        );


        store.dispatch(logoutUser());

        /*
         * Redirect only once
         */
        if (
          window.location.pathname !== "/login"
        ) {
          window.location.replace("/login");
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
