Project 2 Setup
Prerequisites

Node.js and npm must be installed.

MongoDB connection string is required.

1. Backend Setup:
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
