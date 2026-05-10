import shareModel from "../models/share.model.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function createShare(req, res) {
    try {
        const { chatId } = req.body;
        const userId = req.user.id;

        // Fetch original chat to get title
        const chat = await chatModel.findOne({
            _id: chatId,
            user: userId
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Fetch all messages for this chat
        const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });

        // Create a snapshot
        const snapshotMessages = messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.createdAt
        }));

        // Check if a share already exists for this chat (optional, but let's create a new one every time to freeze a new snapshot)
        const share = await shareModel.create({
            user: userId,
            chat: chatId,
            title: chat.title,
            messages: snapshotMessages,
            visibility: 'public'
        });

        res.status(201).json({
            message: "Share link created successfully",
            shareId: share._id,
            shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/share/${share._id}`
        });
    } catch (error) {
        console.error("Error creating share:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getShare(req, res) {
    try {
        const { shareId } = req.params;

        const share = await shareModel.findById(shareId).populate('user', 'username');

        if (!share) {
            return res.status(404).json({ message: "Shared chat not found" });
        }

        // If private, check if requester is the owner (if auth is implemented for viewing)
        // For now, let's keep it simple as requested

        res.status(200).json({
            message: "Shared chat retrieved successfully",
            share
        });
    } catch (error) {
        console.error("Error fetching share:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
