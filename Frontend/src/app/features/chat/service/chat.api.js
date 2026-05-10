import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export const sendMessage = async ({message, chatId}) => {
    const response = await api.post("/api/chats/message", {message, chat: chatId})
    return response.data;
}

export const sendMessageStream = async ({message, chatId, onInit, onContent, onTool, onDone, onError}) => {
    try {
        const response = await fetch("http://localhost:3000/api/chats/message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ message, chat: chatId })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            
            let newlineIndex;
            while ((newlineIndex = buffer.indexOf("\n\n")) >= 0) {
                const eventText = buffer.slice(0, newlineIndex);
                buffer = buffer.slice(newlineIndex + 2);
                
                if (eventText.startsWith("data: ")) {
                    const dataStr = eventText.slice(6);
                    try {
                        const data = JSON.parse(dataStr);
                        if (data.type === 'init') {
                            onInit?.(data);
                        } else if (data.type === 'content') {
                            onContent?.(data.content);
                        } else if (data.type === 'tool') {
                            onTool?.(data.tools);
                        } else if (data.type === 'done') {
                            onDone?.(data.aiMessage);
                        } else if (data.type === 'error') {
                            onError?.(new Error(data.message));
                        }
                    } catch (e) {
                        console.error("Error parsing stream data", e);
                    }
                }
            }
        }
    } catch (err) {
        onError?.(err);
    }
}

export const getChats = async () => {
    const response = await api.get("/api/chats")
    return response.data;
}

export const getMessages = async ({chatId}) => {
    const response = await api.get(`/api/chats/${chatId}/messages`)
    return response.data;
}

export const deleteChat = async ({chatId}) => {
    const response = await api.delete(`/api/chats/delete/${chatId}`)
    return response.data;
}

export const shareChat = async ({chatId}) => {
    const response = await api.post("/api/shares", {chatId})
    return response.data;
}

export const getSharedChat = async (shareId) => {
    const response = await api.get(`/api/shares/${shareId}`)
    return response.data;
}
