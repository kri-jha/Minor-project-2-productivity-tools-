# Gamified Productivity Tool 🚀

Gamified Productivity Tool is a comprehensive, modern productivity and study application designed to help students and professionals focus, collaborate, and manage their time effectively.

## 🌟 Features

- **Collaborative Study Rooms:** Join virtual rooms to study together in real-time.
- **AI Study Tutor:** Get instant, encouraging help from our AI tutor (powered by Google Gemini) right in your study session.
- **Pomodoro Study Timer:** Stay focused and track your study sessions with built-in timers.
- **Task Management:** Keep track of your assignments with To-Dos and Reminders.
- **User Authentication:** Secure sign-up, login, and personalized user profiles.
- **Beautiful UI:** A sleek, responsive, and accessible interface built with Tailwind CSS and Shadcn UI.

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Shadcn UI & Radix UI Primitives
- React Router DOM
- Framer Motion (Animations)

**Backend:**
- Node.js & Express.js
- MongoDB (Mongoose)
- JSON Web Token (JWT) & bcryptjs (Authentication)
- Socket.io (Real-time features)
- Google Generative AI (Gemini Flash)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB (Local instance or MongoDB Atlas cluster)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kri-jha/Minor-project-2-productivity-tools-.git
   cd "Minor-project-2-productivity-tools-"
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

### ⚙️ Environment Variables

Create a `.env` file in the root of your project and add the following variables:

```env
# MongoDB Connection String
MONGO_URI=your_mongodb_connection_string

# JWT Secret for Authentication
JWT_SECRET=your_jwt_secret_key

# Google Gemini API Key for AI Tutor
GEMINI_API_KEY=your_google_gemini_api_key

# Backend Port (optional, defaults to 5000)
PORT=5000
```

### 🏃‍♂️ Running the Application

You need to start both the backend server and the frontend development server.

1. **Start the Backend Server:**
   Open a new terminal and run:
   ```bash
   cd backend
   node server.js
   ```
   *The backend should be running on http://localhost:5000*

2. **Start the Frontend Application:**
   Open another terminal in the root directory and run:
   ```bash
   npm run dev
   ```
   *The frontend should be accessible at http://localhost:8080 (or 8081 if 8080 is in use).*

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/kri-jha/Minor-project-2-productivity-tools-/issues).

## 📝 License

This project is open source and available under the [ISC License](LICENSE).
