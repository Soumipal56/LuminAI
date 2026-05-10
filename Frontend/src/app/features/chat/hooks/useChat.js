import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage as sendMessageAPI, getChats, getMessages, deleteChat, shareChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, setMessages } from "../chat.slice"
import { useDispatch } from "react-redux";

export const useChat = () => {

    const dispatch = useDispatch()

    async function handleSendMessage({ message, chatId }){
        dispatch(setLoading(true))
        try {
            const data = await sendMessageAPI({ message, chatId})
            const { chat, aiMessage } = data
            dispatch(createNewChat({
                chatId: chat._id,
                title: chat.title,
            }))
            dispatch(addNewMessage({
                chatId: chat._id,
                content: message,
                role: "user",
            }))
            dispatch(addNewMessage({
                chatId: chat._id,
                content: aiMessage.content,
                role: aiMessage.role,
            }))
            dispatch(setCurrentChatId(chat._id))
        } catch (err) {
            dispatch(setError(err.message))
        } finally {
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