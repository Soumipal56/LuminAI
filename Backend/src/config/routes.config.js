const prefix = process.env.ROUTE_PREFIX || "/api";

export const ROUTES = {
  prefix,
  auth: {
    base: `${prefix}/auth`,
    register: `${prefix}/auth/register`,
    login: `${prefix}/auth/login`,
    getMe: `${prefix}/auth/get-me`,
    verifyEmail: `${prefix}/auth/verify-email`,
  },
  chats: {
    base: `${prefix}/chats`,
    message: `${prefix}/chats/message`,
    all: `${prefix}/chats`,
    messages: `${prefix}/chats/:chatId/messages`,
    delete: `${prefix}/chats/delete/:chatId`,
  },
  shares: {
    base: `${prefix}/shares`,
    create: `${prefix}/shares`,
    get: `${prefix}/shares/:shareId`,
  },
  health: "/",
};

export default ROUTES;
