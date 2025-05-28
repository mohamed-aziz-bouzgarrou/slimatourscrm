import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const apiBaseUrl =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error("API Error:", error);
    }

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          toast.error(data?.message || "Bad request. Please check your input.");
          break;

        case 401:
          toast.warn("Unauthorized access. Redirecting to login...");
          window.location.href = "/login";
          break;

        case 403:
          toast.error("You don't have permission to access this resource.");
          break;

        case 404:
          toast.error(data?.message || "The resource you are looking for could not be found.");
          break;

        case 500:
          toast.error(data?.message || "Internal server error. Redirecting...");
          window.location.href = "/500";
          break;

        default:
          toast.error(`Error  ${status}: ${data?.message || "An error occurred."}`);
          break;
      }
    } else if (error.request) {
      toast.error("No response received from the server. Please try again later.");
    } else {
      if (
        error.code === "ECONNREFUSED" ||
        error.message.includes("Network Error")
      ) {
        toast.error("Network error, server unreachable. Redirecting...");
        window.location.href = "/server-unreachable";
      }
    }

    return Promise.reject(error);
  }
);

export default api;