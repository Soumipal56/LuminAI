import { io } from "socket.io-client";
import { API } from "../../../../config/api.config.js";

export const initializeSocketConnection = () => {
    const socket = io(API.baseUrl, {
        withCredentials: true
    });
    
    socket.on("connect", () => {
        console.log("Connected to Socket.IO server");
    })
}
