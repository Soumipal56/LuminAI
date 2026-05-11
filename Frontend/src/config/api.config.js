const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

console.log("Current API Base URL:", API_BASE_URL);

export const API = {
  baseUrl: API_BASE_URL,
  auth: {
    register: `${API_BASE_URL}/api/auth/register`,
    login: `${API_BASE_URL}/api/auth/login`,
    getMe: `${API_BASE_URL}/api/auth/get-me`,
    verifyEmail: `${API_BASE_URL}/api/auth/verify-email`,
  },
  chats: {
    base: `${API_BASE_URL}/api/chats`,
    message: `${API_BASE_URL}/api/chats/message`,
    messages: (chatId) => `${API_BASE_URL}/api/chats/${chatId}/messages`,
    delete: (chatId) => `${API_BASE_URL}/api/chats/delete/${chatId}`,
  },
  shares: {
    base: `${API_BASE_URL}/api/shares`,
    get: (shareId) => `${API_BASE_URL}/api/shares/${shareId}`,
  }
};

export default API;
