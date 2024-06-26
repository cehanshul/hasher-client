import axios from "axios";
import { APIResponse } from "../types/expertType";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const userDataJSON = localStorage.getItem("userData");
      if (userDataJSON) {
        const userData = JSON.parse(userDataJSON);
        const token = userData.token;
        console.log(`Token received: ${token}`);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log(
            "Authorization header set:",
            config.headers.Authorization
          );
        } else {
          console.log("No token found in userData.");
        }
      } else {
        console.log("No userData found in localStorage.");
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

export const fetchExpertDataBackend = async (
  username: string
): Promise<any> => {
  console.log("Username received in fetchExpertDataBackend:", username);
  const response = await api.get(`/api/users/${username}`);
  // console.log(`Data from API: ${JSON.stringify(response.data)}`);
  return response.data;
};
