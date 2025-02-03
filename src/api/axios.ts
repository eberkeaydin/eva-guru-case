import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://iapitest.eva.guru", // Tüm istekler için temel URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
