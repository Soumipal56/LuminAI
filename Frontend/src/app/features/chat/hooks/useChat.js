import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessageStream, getChats, getMessages, deleteChat, shareChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, setMessages, updateStreamingMessage } from "../chat.slice"
import { useDispatch } from "react-redux";

export const useChat = () => {

    const dispatch = useDispatch()

    async function handleSendMessage({ message, chatId }){
        dispatch(setLoading(true))
        let newChatId = chatId;

        try {
            await sendMessageStream({
                message, 
                chatId,
                onInit: (data) => {
                    const { chat, title } = data;
                    newChatId = chat._id;
                    dispatch(createNewChat({
                        chatId: chat._id,
                        title: title || chat.title,
                    }))
                    dispatch(addNewMessage({
                        chatId: chat._id,
                        content: message,
                        role: "user",
                    }))
                    dispatch(setCurrentChatId(chat._id))
                    
                    // Create an empty placeholder AI message that will stream text
                    dispatch(addNewMessage({
                        chatId: chat._id,
                        content: "",
                        role: "ai",
                    }))
                },
                onContent: (content) => {
                    dispatch(updateStreamingMessage({
                        chatId: newChatId,
                        content
                    }))
                },
                onTool: (tools) => {
                    // Placeholder: we could display tool usages if desired
                },
                onDone: (aiMessage) => {
                    dispatch(setLoading(false))
                },
                onError: (err) => {
                    dispatch(setError(err.message))
                    dispatch(setLoading(false))
                }
            })
        } catch (err) {
            dispatch(setError(err.message))
            dispatch(setLoading(false))
        }
    }
    
    async function handleGetChats(){
        dispatch(setLoading(true))
        try {
            const data = await getChats()
            const chatsArray = data.chats || []
            
            // Convert array to object mapping _id -> chat
            const chatsObj = chatsArray.reduce((acc, chat) => ({ 
                ...acc, 
                [chat._id]: { ...chat, messages: [] } 
            }), {});
            
            dispatch(setChats(chatsObj))

            // Auto-select the most recent chat on initial load
            if (chatsArray.length > 0) {
                const sortedChats = [...chatsArray].sort((a, b) => b._id.localeCompare(a._id));
                dispatch(setCurrentChatId(sortedChats[0]._id));
            }
        } catch (err) {
            dispatch(setError(err.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetMessages(chatId) {
        if (!chatId) return;
        dispatch(setLoading(true))
        try {
            const data = await getMessages({ chatId })
            const messages = data.messages || []
            
            dispatch(setMessages({ chatId, messages }))
        } catch (err) {
            dispatch(setError(err.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleShareChat(chatId) {
        dispatch(setLoading(true))
        try {
            const data = await shareChat({ chatId })
            return data; // Returns shareId and shareUrl
        } catch (err) {
            dispatch(setError(err.message))
        } finally {
            dispatch(setLoading(false))
        }
    }
    
    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleGetMessages,
        handleShareChat,
    }
}