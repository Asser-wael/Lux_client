import axios from "axios";
import { store } from "../app/store";
import { setAccessToken, logoutUser } from "../features/auth/authSlice";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Request
axiosInstance.interceptors.request.use((config) => {

    const token = store.getState().auth.accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Response
axiosInstance.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            error.response?.data?.code === "TOKEN_EXPIRED" &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            try {

                const { data } = await axiosInstance.post(
                    "/auth/refresh",
                    {},
                    {
                        withCredentials: true,
                    }
                );

                store.dispatch(
                    setAccessToken(data.accessToken)
                );

                originalRequest.headers.Authorization =
                    `Bearer ${data.accessToken}`;

                return axiosInstance(originalRequest);
                console.log("Refresh Success");

            } catch {
                console.log("Refresh Failed");
                store.dispatch(logoutUser());

                window.location.href = "/login";

                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;