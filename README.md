# 🏨 Hostel Management System

A full-stack Hostel Management System built using the MERN stack with role-based authentication. The application allows administrators to manage hostel-related data while students can view information. A Rector role is included for future expansion.

## 🚀 Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control
  - Admin
  - Student (User)
  - Rector (login enabled, features coming soon)

### 👨‍💼 Admin Dashboard
- Create, update, and delete:
  - Rooms
  - Hostel listings
  - Facilities
- Access restricted only to Admin users
- Separate admin dashboard

### 🎓 Student (User)
- View hostel and room details
- Read-only access
- Cannot modify any data

### 🧑‍🏫 Rector
- Can log in to the system
- Role reserved for future features such as:
  - Monitoring hostel status
  - Approving requests
  - Viewing reports

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Tailwind CSS / CSS (as used)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt for password hashing

## 📂 Project Structure
```
hostel-management-system/
│
├── client/              # React frontend
│   ├── src/
│   └── public/
│
├── server/              # Node + Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── config/
│
├── .env
├── package.json
└── README.md
```

## 🔑 User Roles & Permissions

| Role    | Permissions           |
|---------|-----------------------|
| Admin   | Full CRUD access      |
| Student | View-only access      |
| Rector  | Login only (future scope) |

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/hostel-management-system.git
cd hostel-management-system
```

### 2️⃣ Backend Setup
```bash
cd server
npm install
```

Create a `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run backend:
```bash
npm start
```

### 3️⃣ Frontend Setup
```bash
cd client
npm install
npm start
```

## 🔒 Protected Routes

- Admin routes are protected using middleware
- Unauthorized users cannot access admin APIs or dashboards

## 🧠 Future Enhancements

- Room allocation system
- Student complaints & issue tracking
- Fee management
- Rector dashboard features
- Attendance tracking
- Email notifications


---

⭐ If you found this project helpful, please give it a star!
