Overview:
Project 2 is a full-stack web application built with the MERN stack. It allows users to rate and review video games. 

Project 2 Setup
Prerequisites

Node.js and npm must be installed.

MongoDB connection string is required.

1. Backend Setup:
Open your terminal (Command Prompt, PowerShell, or any terminal app) and run:
cd backend
npm install


2. Create a .env file in the backend folder with the following content:

MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>
PORT=5000
JWT_SECRET=<your-secret-key>


3. Start the backend server:

npm run dev

4. Frontend Setup:
cd frontend
npm install

npm start
