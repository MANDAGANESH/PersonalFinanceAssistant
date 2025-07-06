## Demo Link 
https://drive.google.com/file/d/1kxXFlUYQz5R815ZH3r1R7DUukZWGsFLb/view?usp=sharing


# 💰 Personal Financial Assistant

Welcome to the *Personal Financial Assistant*, a dynamic full-stack web application designed to revolutionize personal finance management.

This project empowers users to:
- Track income and expenses
- Visualize financial data through interactive charts
- Extract transactions from uploaded receipts or tabular PDFs

Built with clean, modular code and robust error handling, it showcases modern software engineering practices and serves as a standout portfolio piece for a software engineering placement.

---

## 📑 Table of Contents

- [About](#about)
- [Features](#features)
- [Bonus Features](#bonus-features)
- [Tech Stack](#tech-stack)
- [Data Model](#data-model)
- [Installation](#installation)

---

## 📘 About

The Personal Financial Assistant is a full-stack web application that simplifies personal finance management.

With a sleek, user-friendly interface, users can:
- Register with secure authentication
- Log and categorize transactions
- View detailed financial summaries
- Upload receipts or PDFs to extract expense data

The application separates frontend and backend logic, communicates via RESTful APIs, and persists data in MongoDB for scalability and reliability.

---

## ✨ Features

### 🔐 Authentication
- Secure user registration/login with hashed passwords (bcrypt)
- JWT-based session authentication
- Authorization middleware for protected routes

### 📊 Dashboard
- Pie chart: income vs expenses vs balance
- List of latest transactions
- Filters for time ranges and categories

### 📈 Income & Expenses
- Add income/expense entries with amount, category, date
- View categorized and time-filtered history
- Graphical breakdown of entries

### 🧾 Receipt Upload
- Upload receipts invoices
- Automatically extract expenses via OCR (tesseract.js)

---

## 🚀 Bonus Features

- *Multi-User Support*: JWT-authenticated users with isolated data
- *Pagination*: Handles large datasets
- *Interactive Charts*: Category-wise breakdown, trends

---

## 🛠 Tech Stack

| Layer        | Technology                     |
|--------------|--------------------------------|
| Frontend     | React.js, Tailwind CSS, Axios  |
| Backend      | Node.js, Express.js            |
| Database     | MongoDB (Mongoose ORM)         |
| OCR Engine   | Tesseract.js                   |
| File Upload  | Multer                         |
| Charts       | Chart.js or Recharts           |
| Auth         | JWT (JSON Web Token)           |

---

## 🧩 Data Model

### 👤 User

js
{
  fullName: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  timestamps: true
}
`

* Passwords are hashed using bcrypt.
* Includes method comparePassword for login verification.

---

### 💸 Expense

js
{
  userId: ObjectId (ref: "User", required),
  icon: String,
  category: String (required),
  amount: Number (required),
  date: Date (default: now),
  timestamps: true
}


* Linked to the logged-in user.
* Represents an individual expense entry with optional icon.

---

### 💰 Income

js
{
  userId: ObjectId (ref: "User", required),
  icon: String,
  source: String (required),
  amount: Number (required),
  date: Date (default: now),
  timestamps: true
}


* Linked to the logged-in user.
* Used to record salary, freelance payments, etc.

---

## ⚙ Installation

### ✅ Prerequisites

* Node.js
* MongoDB (local or cloud)
* Git
* A modern web browser

---

### 🔧 Steps

1. *Clone the Repository*

bash
git clone https://github.com/your-username/personal-financial-assistant.git
cd personal-financial-assistant


2. *Install Backend Dependencies*

bash
cd backend
npm install


3. **Create `.env` in backend**

env
PORT=5000
MONGODB_URI=mongouri
JWT_SECRET=your_secret_key


4. **Start the Backend**

bash
npm start


5. *Install Frontend Dependencies*

bash
cd ../frontend
npm install


6. **Start the Frontend**

npm start


---
