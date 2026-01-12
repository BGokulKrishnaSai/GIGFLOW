# GigFlow - Freelance Marketplace Platform

A full-stack freelance marketplace platform built with React, Node.js, Express, and MongoDB. This platform allows clients to post gigs and freelancers to bid on them, with real-time notifications and secure hiring workflows.

## 🚀 Features

### Core Features
- **User Authentication**: Secure JWT-based authentication with HttpOnly cookies
- **Gig Management**: Create, browse, search, and filter gigs
- **Bidding System**: Submit bids on gigs with messages and pricing
- **Hiring Workflow**: Atomic hiring process with transactional integrity
- **Real-time Notifications**: Instant notifications when freelancers are hired (Socket.io)
- **Responsive Design**: Beautiful, animated UI with Tailwind CSS and Framer Motion

### Bonus Features Implemented
- **Transactional Integrity**: MongoDB transactions ensure race-condition-free hiring
- **Real-time Updates**: Socket.io integration for instant hire notifications

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Socket.io Client** for real-time features

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Socket.io** for real-time communication
- **CORS** and security middleware

## 📁 Project Structure

```
GigFlow/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # State management
│   │   ├── services/      # API and socket services
│   │   └── utils/         # Helper functions
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── config/           # Database config
│   └── server.js         # Main server file
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://your-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

4. **Start the server:**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user

### Gigs
- `GET /api/gigs` - Get all open gigs (with search/filter)
- `GET /api/gigs/:id` - Get single gig
- `POST /api/gigs` - Create new gig (protected)
- `PATCH /api/gigs/:id` - Update gig (protected)
- `DELETE /api/gigs/:id` - Delete gig (protected)

### Bids
- `POST /api/bids` - Submit bid on gig (protected)
- `GET /api/bids/gig/:gigId` - Get all bids for a gig (owner only)
- `GET /api/bids/user/my-bids` - Get user's submitted bids (protected)
- `PATCH /api/bids/:bidId/hire` - Hire freelancer (owner only, atomic)

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  bio: String,
  createdAt: Date
}
```

### Gig Model
```javascript
{
  title: String,
  description: String,
  budget: Number,
  category: String,
  skills: [String],
  ownerId: ObjectId (ref: User),
  status: String (enum: ['open', 'assigned']),
  createdAt: Date
}
```

### Bid Model
```javascript
{
  gigId: ObjectId (ref: Gig),
  freelancerId: ObjectId (ref: User),
  message: String,
  bidAmount: Number,
  status: String (enum: ['pending', 'hired', 'rejected']),
  createdAt: Date
}
```

## 🔐 Security Features

- **JWT Authentication** with HttpOnly cookies
- **Password Hashing** with bcryptjs
- **CORS Protection** with proper origin validation
- **Input Validation** and sanitization
- **Rate Limiting** (can be added)
- **SQL Injection Protection** via Mongoose ODM

## ⚡ Key Implementation Details

### Transactional Hiring Logic
The hiring process uses MongoDB transactions to ensure atomicity:

```javascript
const session = await Bid.startSession();
session.startTransaction();

// 1. Update gig status to 'assigned'
// 2. Set selected bid status to 'hired'
// 3. Set all other bids to 'rejected'

await session.commitTransaction();
```

### Real-time Notifications
Socket.io enables instant notifications:

```javascript
// Server-side
io.to(`user_${freelancerId}`).emit('hired', {
  message: `Congratulations! You have been hired for "${gig.title}"`,
  gig: gigData,
  bid: bidData
});

// Client-side
socketService.onHired((data) => {
  dispatch(addNotification(data));
});
```

## 🎨 UI/UX Features

- **Responsive Design**: Works on all device sizes
- **Smooth Animations**: Framer Motion for professional feel
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time feedback
- **Dark/Light Theme Ready**: Easy to extend

## 🚀 Deployment

### Backend Deployment (Railway, Heroku, etc.)
1. Set environment variables
2. Deploy server code
3. Ensure MongoDB connection

### Frontend Deployment (Vercel, Netlify, etc.)
1. Build the project: `npm run build`
2. Set API base URL environment variable
3. Deploy the `dist` folder

## 📝 Usage Guide

### For Clients:
1. Register/Login as a user
2. Post gigs with title, description, budget, and category
3. View bids from freelancers
4. Hire freelancers with one click (atomic operation)

### For Freelancers:
1. Register/Login as a user
2. Browse and search for gigs
3. Submit bids with messages and pricing
4. Receive real-time notifications when hired

## 🧪 Testing the Hiring Flow

## **Detailed Project Review (For Reviewer)**

This section is a focused guide for reviewers to quickly understand, verify, and test the core deliverables of the GigFlow assignment.

- **Objective:** Validate a secure freelance marketplace where clients post gigs, freelancers bid, and the client can atomically hire one freelancer while rejecting others. Real-time notifications should be delivered to freelancers upon hire or rejection.

- **High-level Architecture:**
   - Frontend: React (Vite) + Tailwind + Redux Toolkit. Connects to backend via `/api/*` endpoints and uses Socket.io client for realtime.
   - Backend: Node.js + Express. Uses Mongoose for MongoDB models. JWT tokens are returned and set as HttpOnly cookies. Socket.io runs attached to the HTTP server and is available to controllers via `req.app.get('io')`.

- **Critical Files to Inspect:**
   - Server entry and socket wiring: `server/server.js`
   - Auth controllers/middleware: `server/controllers/authController.js`, `server/middleware/auth.js`
   - Gig controllers: `server/controllers/gigController.js`
   - Bid controllers (hiring & reject): `server/controllers/bidController.js`
   - Mongoose models: `server/models/User.js`, `server/models/Gig.js`, `server/models/Bid.js`
   - Client socket service: `client/src/services/socketService.js`
   - Client auth slice (connects socket on login): `client/src/redux/slices/authSlice.js`
   - Client pages to test flows: `client/src/pages/GigDetail.jsx`, `client/src/pages/MyGigs.jsx`, `client/src/pages/MyBids.jsx`

- **Hiring Flow (Data + Transactional Steps)**
   1. Client calls `PATCH /api/bids/:bidId/hire` (protected, owner-only).
   2. Server starts a MongoDB session: `const session = await Bid.startSession()` and `session.startTransaction()`.
   3. Server validates bid and gig ownership, ensures gig is still `open` and bid is `pending`.
   4. Server updates `Gig.status = 'assigned'`, sets chosen bid `status = 'hired'`, and sets all other pending bids for that gig to `status = 'rejected'` within the same transaction.
   5. Server commits transaction. If an error occurs, server aborts the transaction and returns an error.
   6. After commit, server populates the hired bid and emits a socket notification to the freelancer's room `user_<freelancerId>` (if Socket.io is initialized).

- **Realtime Flow**
   - On successful login the frontend calls `socketService.connect(userId)` which opens a socket and emits `join-user-room` with the logged-in user id.
   - Server `io.on('connection')` listens and joins sockets into `user_<id>` rooms.
   - Controllers emit `hired` and `bidRejected` events to these rooms to notify freelancers instantly.

- **Manual Verification Steps (Recommended)**
   1. Start backend and frontend locally (see Setup). Ensure both running and CORS configured for `http://localhost:5173`.
   2. Create two users (Client A and Freelancer B). Keep them in separate browser profiles or incognito windows.
   3. Client A posts a gig. Freelancer B submits a bid on that gig.
   4. Client A opens the gig (or My Gigs) and clicks `Hire` on the bid.
       - Verify: Gig changes to `assigned` in UI.
       - Verify: The hired bid's status becomes `hired` and appears under `My Bids` for the freelancer as `✓ Hired`.
       - Verify: Any other pending bids for the gig become `rejected`.
       - Verify: Freelancer B receives an instant notification (check browser console and NotificationCenter UI).
   5. Test rejection: Client rejects another pending bid with a reason — verify freelancer sees rejection reason in `My Bids`.

- **Reviewer Checklist (to include in submission)**
   - [ ] GitHub repository link provided
   - [ ] Live hosted link (frontend + backend) provided
   - [ ] `.env.example` present with required variables
   - [ ] README contains setup and verification steps (this section)
   - [ ] Loom demo link (2 minutes) showing the hiring flow
   - [ ] Transactional hiring implemented (server side) — check `server/controllers/bidController.js`
   - [ ] Socket.io wired on server and client — check `server/server.js` and `client/src/services/socketService.js`

- **Quick commands for reviewer**
   - Start backend:
      ```bash
      cd server
      npm install
      node server.js
      ```
   - Start frontend:
      ```bash
      cd client
      npm install
      npm run dev
      ```

If you want, I can also add a short demo GIF or embed the Loom link in this README — tell me the hosted URL and I will add it.

1. **Create two accounts**: One client, one freelancer
2. **Client posts a gig**
3. **Freelancer submits a bid**
4. **Client views bids and clicks "Hire"**
5. **Freelancer receives instant notification**
6. **Gig status changes to "assigned"**
7. **Other bids automatically rejected**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**B Gokul Krishna Sai** - Full-Stack Developer

---

**Note**: This project was built as part of a freelance marketplace internship assignment, demonstrating complex database relationships, secure authentication, real-time features, and transactional integrity.
