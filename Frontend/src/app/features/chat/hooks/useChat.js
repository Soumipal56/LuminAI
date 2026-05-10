import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage as sendMessageAPI, getChats, getMessages, deleteChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage } from "../chat.slice"
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
    
    async function fetchChats(){
        dispatch(setLoading(true))
        try {
            const chats = await getChats()
            // Convert array to object if necessary, or just dispatch if backend returns object
            const chatsObj = Array.isArray(chats) 
                ? chats.reduce((acc, chat) => ({ ...acc, [chat._id]: chat }), {})
                : chats;
            dispatch(setChats(chatsObj))
        } catch (err) {
            dispatch(setError(err.message))
        } finally {
            dispatch(setLoading(false))
        }
    }
    
    return {
        initializeSocketConnection,
        handleSendMessage,
        fetchChats,
    }
}