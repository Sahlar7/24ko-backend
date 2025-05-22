# 24KO-Backend
A multiplayer spin on the classic math game, 24! Play with your friends and try to survive as you combine numbers to make 24.

## Local Setup

1. **Clone the repository**  
   ```
   git clone https://github.com/Sahlar7/24ko-backend.git
   cd 24ko-backend
   ```

2. **Install dependencies**  
   ```
   npm install
   ```

3. **Create a `.env` file**  
   Add a `.env` file in the root directory (if needed) and specify the FRONTEND_URL and any other environment variables, for example:
   ```
   FRONTEND_URL="http://localhost:3000"
   ```
   You can change the port of the frontend url to whatever you have yours configured to.
4. **Start the backend server**  
   ```
   node index.js
   ```
   The server will start on `http://localhost:3001` by default.

5. **Connect the frontend**  
   Make sure your frontend is configured to use the same backend URL (e.g., `http://localhost:3001`).

You can now open multiple browser windows or tabs and play with friends locally!
