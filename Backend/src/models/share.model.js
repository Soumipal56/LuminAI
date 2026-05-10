import mongoose from 'mongoose';

const shareSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat',
        },
        title: {
            type: String,
            required: true,
        },
        messages: [
            {
                role: {
                    type: String,
                    enum: ['user', 'ai'],
                    required: true,
                },
                content: {
                    type: String,
                    required: true,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                }
            }
        ],
        visibility: {
            type: String,
            enum: ['public', 'private'],
            default: 'public',
        }
    },
    { timestamps: true }
);

const shareModel = mongoose.model('Share', shareSchema);

export default shareModel;
