const prefix = process.env.ROUTE_PREFIX || "/api";

export const ROUTES = {
  prefix,
  auth: {
    base: "/",
    register: "/register",
    login: "/login",
    getMe: "/get-me",
    verifyEmail: "/verify-email",
  },
  chats: {
    base: "/",
    message: "/message",
    all: "/",
    messages: "/:chatId/messages",
    delete: "/delete/:chatId",
  },
  shares: {
    base: "/",
    create: "/",
    get: "/:shareId",
  },
  health: "/",
};

export default ROUTES;
