# 🎓 VIT Events Notification Management System

A comprehensive MERN stack application for managing events and notifications at VIT Chennai. Features role-based access control for Students, Coordinators, and Admins with email notification capabilities.

## ✨ Features

### 👨‍🎓 Students
- Browse and search all events with beautiful card-based UI
- Register/unregister for events
- Manage notification preferences (opt-in/out by category)
- View registered events in profile
- Real-time validation and toast notifications

### 👨‍🏫 Coordinators
- Create, edit, and delete events
- View event registrations with CSV export
- Send email notifications to registered participants
- Rich text email editor with formatting tools
- Dashboard with quick access to all features

### 👨‍💼 Admins
- **User Management**: Create, view, update, and delete users with role management
- **Category Management**: Create and manage event categories
- **Event Monitoring**: View all events across the system
- **Notification Monitor**: Track notification delivery status and logs
- **System Dashboard**: Overview of users, events, notifications, and categories

## 🏗️ Tech Stack

- **Frontend**: React 19, TailwindCSS, React Router, React Hot Toast
- **Backend**: Node.js, Express.js, JWT Authentication, Bcrypt
- **Database**: MongoDB with Mongoose ODM
- **Notifications**: Nodemailer (SMTP email)

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud instance)
- SMTP credentials for email notifications

### Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# - MONGODB_URI
# - JWT_SECRET
# - JWT_REFRESH_SECRET
# - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

The app will be available at `http://localhost:3000` (frontend) and `http://localhost:5000` (backend).

## 📁 Project Structure

```
swProject/
├── backend/
│   ├── config/          # Database and app configuration
│   ├── controllers/     # Request handlers (auth, events, users, etc.)
│   ├── middleware/      # Auth middleware, RBAC, logging
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API route definitions
│   └── server.js        # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── api/         # API client functions
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React contexts (Auth)
│   │   ├── pages/       # Page components
│   │   │   ├── Admin/   # Admin dashboard and management pages
│   │   │   └── Coordinator/ # Coordinator pages
│   │   └── App.jsx      # Main app component with routing
│   └── package.json
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token

### Users (Admin only)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (admin)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin)

### Events
- `GET /api/events` - List all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (coordinator/admin)
- `PUT /api/events/:id` - Update event (coordinator/admin)
- `DELETE /api/events/:id` - Delete event (coordinator/admin)
- `POST /api/events/:id/register` - Register for event (student only)
- `GET /api/events/:id/registrations` - List registrations (coordinator/admin)

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:type` - Get category by type
- `POST /api/categories` - Create category (admin)

### Notifications
- `GET /api/notifications` - List notifications (admin)
- `POST /api/notifications/events/:id/email` - Send event email (coordinator)
- `POST /api/notifications/events/:id/test-email` - Test email send

### Preferences
- `GET /api/preferences/:userId` - Get user preferences
- `PUT /api/preferences/:userId` - Update preferences

## 🔐 Role-Based Access Control

- **Student**: Can register for events, manage preferences, view profile
- **Coordinator**: Can create/manage own events, send notifications, view registrations
- **Admin**: Full system access - user management, category management, all events

## 🎨 UI Features

- **Modern Design**: Gradient backgrounds, card-based layouts, smooth animations
- **Toast Notifications**: Beautiful popup notifications using react-hot-toast
- **Responsive**: Mobile-friendly design with TailwindCSS
- **Rich Text Editor**: Email composer with formatting tools (bold, italic, lists, links)
- **Search & Filter**: Real-time event search functionality
- **Category Badges**: Color-coded category indicators

## 📝 Validation

### Backend
- Email format validation
- Password strength (min 6 characters)
- Mobile number format (+91 followed by 10 digits)
- Required field validation

### Frontend
- Client-side validation with immediate feedback
- Toast notifications for errors and success
- Form validation before submission

## 🔔 Notification System

- **Email Notifications**: SMTP-based email sending via Nodemailer
- **Templating**: Placeholder support (`{{name}}`, `{{event.title}}`, etc.)
- **Delivery Logging**: Track sent, failed, and pending notifications
- **Test Mode**: Send test emails before bulk sending
- **Rich Formatting**: HTML email support with formatting toolbar

## 🛡️ Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Role-based route protection
- Input validation and sanitization
- Cascade deletion for data integrity

## 📦 Key Dependencies

### Backend
- express, mongoose, jsonwebtoken, bcryptjs, nodemailer, cors, dotenv

### Frontend
- react, react-router-dom, axios, react-hot-toast, tailwindcss

## 🚧 Future Enhancements

- SMS and WhatsApp notification channels
- Push notifications
- Event calendar view
- Advanced analytics dashboard
- Email templates library
- Bulk user import/export

## 📄 License

This project is developed for VIT Chennai's event notification system.
