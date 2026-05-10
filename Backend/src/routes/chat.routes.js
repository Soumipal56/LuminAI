import { Router } from "express";
import { sendMessage, getChats, getMessages, deleteChat } from "../controllers/chat.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import ROUTES from "../config/routes.config.js";

const chatRouter = Router();

chatRouter.post(ROUTES.chats.message, authUser, sendMessage);

chatRouter.get(ROUTES.chats.all, authUser, getChats)

chatRouter.get(ROUTES.chats.messages, authUser, getMessages)

chatRouter.delete(ROUTES.chats.delete, authUser, deleteChat)

export default chatRouter;