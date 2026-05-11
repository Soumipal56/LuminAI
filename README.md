# 🌟 LuminAI - Advanced AI Chat & Real-Time Search Platform

LuminAI is a sophisticated AI-powered chat application designed to provide users with accurate, real-time information. Leveraging cutting-edge Large Language Models (LLMs) and deep internet integration, LuminAI goes beyond static knowledge to deliver up-to-the-minute insights through a sleek, modern interface.

![LuminAI Banner](https://github.com/Soumipal56/LuminAI/raw/main/Frontend/public/banner.png) *(Note: Add your actual banner image path here)*

## 🚀 Features

- **Real-Time Internet Search**: Integrated with Tavily AI to fetch the latest news and facts from the web.
- **Streaming Responses**: Token-by-token response delivery for a seamless, low-latency conversational experience.
- **Persistent Chat History**: Save and manage your conversations securely with MongoDB.
- **Hybrid Authentication**: Secure JWT-based authentication supporting both Cookies and Authorization headers.
- **Multi-Model Support**: Dynamically switches between Mistral AI and Google Gemini for maximum reliability.
- **Modern UI/UX**: A responsive, premium dashboard with dark/light mode support and glassmorphic design.
- **Shareable Chats**: Generate unique public links to share your AI conversations with others.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Redux Toolkit, Socket.io-client.
- **Backend**: Node.js, Express.js, Socket.io, LangChain.
- **Database**: MongoDB (Mongoose).
- **AI/LLM**: Mistral AI, Google Generative AI (Gemini).
- **Search API**: Tavily AI.

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- API Keys for Mistral, Google Gemini, and Tavily

### 1. Clone the Repository
```bash
git clone https://github.com/Soumipal56/LuminAI.git
cd LuminAI
```

### 2. Install Dependencies
```bash
# Install root, backend, and frontend dependencies
npm install
npm run install-all
```

### 3. Environment Variables
Create a `.env` file in the `Backend` directory:
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
MISTRAL_API_KEY=your_mistral_key
TAVILY_API_KEY=your_tavily_key
GOOGLE_API_KEY=your_gemini_key
FRONTEND_URL=http://localhost:5173
BASE_URL=http://localhost:3000
```

### 4. Run Locally
```bash
# Start both backend and frontend in development mode
# From the root directory:
npm run dev --prefix Backend
npm run dev --prefix Frontend
```

## 🌐 Deployment (Render)

LuminAI is optimized for deployment on **Render**.

1. **Build Command**: `npm run build`
2. **Start Command**: `npm start`
3. **Environment Variables**: Ensure all variables from your `.env` are added to the Render Dashboard.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by [Soumi Pal](https://github.com/Soumipal56)
