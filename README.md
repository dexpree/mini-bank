# mini-bank
# 🏦 Mini Bank Management System with Goal-Based Savings

## 📌 Project Overview

The **Mini Bank Management System** is a web-based banking application developed to simplify basic banking operations and help users manage their finances digitally. The system provides features such as user registration, secure login, deposits, withdrawals, fund transfers, transaction history, and goal-based savings.

The application also includes an administrative module that allows administrators to manage users, approve or reject accounts, freeze accounts, monitor transactions, manage savings goals, and configure interest-related features.

The project is developed using the MERN stack, which consists of MongoDB, Express.js, React.js, and Node.js.

## 🎯 Objectives

- To provide a simple and user-friendly digital banking platform.
- To manage basic banking transactions efficiently.
- To maintain transaction records and account information.
- To encourage financial discipline through goal-based savings.
- To provide administrative control over user accounts.
- To implement authentication and role-based access control.
- To improve the accessibility and management of banking operations.

## ✨ Features

### 👤 User Features

- User registration and login.
- Secure authentication using JSON Web Tokens (JWT).
- Password hashing for enhanced security.
- User profile management.
- View account information and balance.
- Deposit money.
- Withdraw money.
- Transfer funds between accounts.
- View transaction history.
- Create and manage savings goals.
- Track savings progress toward financial goals.

### 🛡️ Admin Features

- Administrative login and dashboard.
- View registered users.
- Approve or reject user accounts.
- Block or freeze user accounts.
- Monitor banking transactions.
- Manage savings goals.
- Configure interest-related functionality.
- Manage user account status.

### 💰 Goal-Based Savings

The goal-based savings module helps users plan and track their financial targets.

Users can:
- Create savings goals.
- Set a target amount.
- Track their savings progress.
- Monitor progress toward their financial objectives.
- Manage their goals through the application.

### 🔐 Security Features

- JWT-based authentication.
- Password hashing using bcryptjs.
- Role-based access control.
- Protected routes and API endpoints.
- Environment variable configuration for sensitive settings.
- Server-side validation of banking operations.

## 🛠️ Technologies Used

### Frontend
- React.js
- Vite
- JavaScript
- React Router
- Axios
- Bootstrap 5
- CSS3

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication and Security
- JSON Web Tokens (JWT)
- bcryptjs
- dotenv

### Development Tools
- Visual Studio Code
- MongoDB Compass
- Postman
- Git
- GitHub

## 📂 Project Structure

```text
mini-bank/
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

*Note: The folder structure may differ depending on the implementation in your repository.*

## ⚙️ Installation and Setup

### Prerequisites

Install the following software before running the application:

- Node.js and npm
- MongoDB or MongoDB Atlas
- Visual Studio Code or another code editor
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/dexpree/mini-bank.git
```

Navigate to the project directory:

```bash
cd mini-bank
```

### 2. Configure the Backend

Navigate to the backend folder:

```bash
cd Backend
```

Install the required dependencies:

```bash
npm install
```

Create a `.env` file inside the `Backend` directory and configure the required environment variables.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
```

Replace the example values with your actual configuration. Add any other environment variables required by your implementation.

**Important:** Never upload real database credentials, passwords, JWT secrets, or API keys to GitHub.

### 3. Start the Backend Server

If your backend defines a development script, run:

```bash
npm run dev
```

Alternatively, if your `package.json` defines a start script, run:

```bash
npm start
```

The backend will run on the configured port. In the example above, the port is `5000`.

### 4. Configure the Frontend

Open a new terminal in the project root and navigate to the frontend directory:

```bash
cd Frontend
```

Install the dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal. Open that URL in your browser, usually:

```text
http://localhost:5173
```

Keep both the backend and frontend servers running while using the application.

## 🗄️ Database Configuration

The application uses MongoDB to store relevant banking information, including:

- User and account information.
- Transaction records.
- Deposit and withdrawal details.
- Fund transfer records.
- Savings goals and their progress.
- Account approval and status information.

Mongoose is used to define data models and interact with the MongoDB database.

Ensure that your MongoDB service or Atlas database is running and that the connection string is correctly configured.

## 🧪 Testing

The application can be tested using the following test scenarios:

- User registration and login.
- Authentication and authorization.
- Account approval and rejection.
- Deposit and withdrawal operations.
- Fund transfers between accounts.
- Transaction history retrieval.
- Savings goal creation and progress tracking.
- Account blocking and freezing.
- Administrative transaction monitoring.
- Database connectivity and API response validation.

Postman can be used to test backend APIs, while MongoDB Compass can be used to inspect database records.

## 🚀 Future Enhancements

- Email and SMS notifications for transactions.
- Downloadable account statements.
- Improved financial analytics and reports.
- Budget planning and expense tracking.
- Automated savings recommendations.
- Two-factor authentication.
- Enhanced fraud detection and transaction monitoring.
- Mobile application support.

## 🎓 Project Information

**Project Name:** Mini Bank Management System with Goal-Based Savings

**Project Type:** Full-Stack Web Application

**Project Domain:** Banking and Financial Management

**Technology Stack:** MongoDB, Express.js, React.js, Node.js (MERN)

## 👨‍💻 Author

**Preetham**

GitHub: [https://github.com/dexpree](https://github.com/dexpree)

## 📄 License

This project is developed for academic and educational purposes. Add an appropriate open-source license if you intend to permit public reuse or distribution.

## ⚠️ Disclaimer

This project is intended for educational and demonstration purposes. It is not a production banking system and should not be used to manage real financial transactions without appropriate security controls, financial compliance, auditing, and professional review.