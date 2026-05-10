import { generateResponseStream, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {

    const { message, chat: chatId } = req.body;


    let effectiveChatId = chatId;
    let title = null;
    let chat = null;

    if (chatId) {
        const messageCount = await messageModel.countDocuments({ chat: chatId });
        if (messageCount >= 10) {
            effectiveChatId = null;
        }
    }

    if (!effectiveChatId) {
        title = await generateChatTitle(message);
        chat = await chatModel.create({
            user: req.user.id,
            title
        })
    } else {
        chat = await chatModel.findOne({ _id: effectiveChatId, user: req.user.id });
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
    }

    const userMessage = await messageModel.create({
        chat: effectiveChatId || chat._id,
        content: message,
        role: "user"
    })

    const messages = await messageModel.find({ chat: effectiveChatId || chat._id })

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send initial chat info
    res.write(`data: ${JSON.stringify({ type: 'init', chat, title })}\n\n`);

    try {
        const stream = await generateResponseStream(messages);
        let finalResponse = "";

        for await (const event of stream) {
            if (event.event === "on_chat_model_stream") {
                const chunk = event.data.chunk;
                // Accumulate tokens as they stream in
                if (chunk && typeof chunk.content === 'string') {
                    finalResponse += chunk.content;
                    res.write(`data: ${JSON.stringify({ type: 'content', content: finalResponse })}\n\n`);
                }
            } else if (event.event === "on_tool_start") {
                res.write(`data: ${JSON.stringify({ type: 'tool', tools: [event.name] })}\n\n`);
            }
        }

        const aiMessage = await messageModel.create({
            chat: effectiveChatId || chat._id,
            content: finalResponse,
            role: "ai"
        });

        res.write(`data: ${JSON.stringify({ type: 'done', aiMessage })}\n\n`);
        res.end();

    } catch (err) {
        console.error("Streaming error:", err);
        res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
        res.end();
    }
}

export async function getChats(req, res){
    const user = req.user

    const chats = await chatModel.find({
        user: user.id
    })

    res.status(200).json({
        message: "Chats recieved successfully",
        chats
    })
}

export async function getMessages(req, res){
    const { chatId } = req.params

    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id
    })

    if(!chat){
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    const messages = await messageModel.find({
        chat: chatId
    })

    res.status(200).json({
        message: "Messages recieved successfully",
        messages
    })
}

export async function deleteChat(req, res){
    const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })

    await messageModel.deleteMany({
        chat: chatId
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    res.status(200).json({
        message: "Chat deleted successfully"
    })
}