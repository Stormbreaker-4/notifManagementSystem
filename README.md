# 🎓 VIT Events Notification Management System

## 📌 Overview
This project is a **MERN stack application** that overhauls the existing notification system for students at **VIT Chennai**.  

### ✨ Key Features
- **Students**
  - View all events (categorized: Club, Workshop, Fest, Recruitment).
  - Manage notification preferences (opt-in/out).
  - Register/unregister for events.
  - View registered events in profile.
- **Coordinators**
  - Create/update their events.
  - View participants list.
  - Trigger notifications via Email / SMS / WhatsApp / Push.
- **Admin** *(future work)*
  - Manage categories and users.
  - Monitor logs and system status.

---

## 🏗️ Tech Stack
- **Frontend:** React.js, TailwindCSS, Context API  
- **Backend:** Node.js, Express.js, JWT Auth, Bcrypt  
- **Database:** MongoDB (Mongoose ORM)  
- **Notifications:** Email, SMS, WhatsApp APIs (extensible)  

---

## 🚀 Project Structure
```
vit-notification-system/
│── backend/            # Node.js + Express backend
│ ├── models/           # Mongoose schemas (User, Event, Category, Preference, Notification)
│ ├── routes/           # API routes
│ ├── controllers/      # Request handlers
│ ├── middleware/       # Auth & role-based access
│── frontend/           # React frontend
│ ├── src/components    # Navbar, UI elements
│ ├── src/pages         # Home, Login, Register, Profile, Dashboard
│ ├── src/context       # AuthContext
│── README.md
│── .gitignore
```
---

## 🔑 API Endpoints (Summary)

### Auth
- `POST /api/auth/register` – Register user  
- `POST /api/auth/login` – Login user  

### Users
- `GET /api/users` – List all (admin)  
- `GET /api/users/:id` – Get user details  
- `PUT /api/users/:id` – Update user (self or admin)  
- `DELETE /api/users/:id` – Delete user (admin)  

### Events
- `GET /api/events` – List all events  
- `POST /api/events` – Create event (coordinator)  

### Preferences
- `GET /api/preferences/:userId` – View user preferences  
- `PUT /api/preferences/:userId` – Update preferences  

### Notifications
- `GET /api/notifications` – List notifications  
- `POST /api/notifications/log` – Log notification attempt  
- `PUT /api/notifications/:id/status` – Update status  

### Categories
- `POST /api/categories` – Add category (admin)  
- `GET /api/categories/:type` – Get category by type  

---

## 📸 Screenshots (to be added)
- Student Home Page (event listing)  
- Profile (Preferences Sidebar)  
- Coordinator Dashboard  

---

## ⚙️ Setup Instructions

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```