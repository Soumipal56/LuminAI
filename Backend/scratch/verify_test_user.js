import mongoose from "mongoose";
import "dotenv/config";

const userSchema = new mongoose.Schema({
    email: String,
    verified: Boolean
}, { strict: false });

const User = mongoose.model('User', userSchema, 'users');

async function verifyUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
        
        const result = await User.updateOne(
            { email: "testuser123@example.com" },
            { $set: { verified: true } }
        );
        
        console.log("Update result:", result);
    } catch (err) {
        console.error("Error verifying user:", err);
    } finally {
        await mongoose.connection.close();
    }
}

verifyUser();
