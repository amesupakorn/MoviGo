import axios from "axios";

const api = axios.create({
  baseURL: "/api", // เปลี่ยนเป็น URL จริงของเซิร์ฟเวอร์ถ้าจำเป็น
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor สำหรับเพิ่ม Token อัตโนมัติ
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🛠️ Interceptor สำหรับ Handle 401 Unauthorized 
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token"); 
      window.location.href = "/client/auth/login"; 
    }
    return Promise.reject(error);
  }
);

export default api;
