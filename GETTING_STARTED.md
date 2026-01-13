# 📖 GigFlow - Getting Started Guide

Welcome to the GigFlow repository! This guide will help you set up and deploy the application.

## 🎯 Choose Your Path

### 👨‍💻 For Developers (Local Development)
Start here → [`LOCAL_SETUP.md`](./LOCAL_SETUP.md)

**Quick commands:**
```bash
cd server && npm install && npm run dev  # Terminal 1
cd client && npm install && npm run dev  # Terminal 2
```

### 🚀 For DevOps/Deployment (Production)
Start here → [`DEPLOYMENT.md`](./DEPLOYMENT.md)

**Quick steps:**
1. Push code to GitHub
2. Create services on Render
3. Set environment variables
4. Deploy!

### ⚡ For Quick Reference
See [`QUICK_START.md`](./QUICK_START.md) for a one-page overview.

## 📁 Project Structure

```
GigFlow/
├── server/               # Backend (Node.js + Express)
│   ├── controllers/     # API logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, validation
│   ├── config/          # Database config
│   ├── .env.example     # Environment template
│   └── server.js        # Main server file
│
├── client/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/       # Route pages
│   │   ├── components/  # React components
│   │   ├── services/    # API & Socket.io clients
│   │   ├── redux/       # State management
│   │   └── utils/       # Helpers
│   ├── .env.example     # Environment template
│   └── vite.config.js   # Vite config
│
├── QUICK_START.md       # One-page reference
├── LOCAL_SETUP.md       # Local development guide
├── DEPLOYMENT.md        # Production deployment guide
├── render.yaml          # Render.com infrastructure config
└── README.md            # Project documentation
```

## 🚀 5-Minute Quick Start

### Prerequisites
- Node.js v16+
- MongoDB Atlas account (free)
- Git

### Setup

**Terminal 1 - Backend:**
```bash
cd server
npm install
cp .env.example .env
# Edit .env: Add your MongoDB URI
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm run dev
```

**Open:** http://localhost:5173

## 🌐 Deploy to Production

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **Set up on Render**
   - Backend: Create Web Service (Node.js)
   - Frontend: Create Static Site
   - Set environment variables as shown in `DEPLOYMENT.md`

3. **Test deployment**
   ```bash
   # Backend health
   curl https://your-backend.onrender.com/api/health
   
   # Frontend
   Visit https://your-frontend.onrender.com
   ```

## 📋 Environment Variables

### Server (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?appName=GigFlow
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### Client (.env.local or Render vars)
```env
VITE_API_URL=http://localhost:5000/api
```

## ✨ Key Features

- ✅ User authentication with JWT
- ✅ Post gigs and receive bids
- ✅ Bid on available gigs
- ✅ Atomic hiring (hire one, reject others automatically)
- ✅ Real-time notifications with Socket.io
- ✅ MongoDB Atlas integration
- ✅ Responsive Tailwind CSS design
- ✅ Redux state management

## 🔧 Technology Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Socket.io (Real-time)
- CORS enabled

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios + Socket.io client

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [`QUICK_START.md`](./QUICK_START.md) | One-page reference guide |
| [`LOCAL_SETUP.md`](./LOCAL_SETUP.md) | Detailed local development setup |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | Production deployment on Render |
| [`README.md`](./README.md) | Full project documentation |
| [`render.yaml`](./render.yaml) | Infrastructure-as-code for Render |

## ⚠️ Important Notes

1. **Never commit `.env`** - Only commit `.env.example`
2. **Change JWT_SECRET** for production
3. **MongoDB Atlas** required - Add Render's IP to whitelist
4. **CORS Configuration** - Automatically reads from `CLIENT_URL` env variable
5. **Socket.io** - Also dynamically configured via `CLIENT_URL`

## 🆘 Need Help?

- **Local setup issues?** → See [`LOCAL_SETUP.md`](./LOCAL_SETUP.md#troubleshooting)
- **Deployment problems?** → See [`DEPLOYMENT.md`](./DEPLOYMENT.md#-troubleshooting)
- **Want quick reference?** → See [`QUICK_START.md`](./QUICK_START.md)
- **Project details?** → See [`README.md`](./README.md)

## ✅ Deployment Checklist

Before deploying to production:

- [ ] All `.env` files are in `.gitignore`
- [ ] `.env.example` files are committed
- [ ] Backend tested locally
- [ ] Frontend tested locally
- [ ] Login/Register working
- [ ] Gig posting working
- [ ] Bidding system working
- [ ] Real-time notifications working
- [ ] MongoDB connection verified
- [ ] JWT_SECRET changed from default
- [ ] Render environment variables set
- [ ] CORS origins configured correctly
- [ ] Socket.io connections established

## 🎓 Learning Resources

- [Express.js Docs](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Socket.io](https://socket.io/docs/)

---

**Ready to get started?**

- New to the project? → Read [`LOCAL_SETUP.md`](./LOCAL_SETUP.md)
- Ready to deploy? → Read [`DEPLOYMENT.md`](./DEPLOYMENT.md)
- Need a quick reference? → Read [`QUICK_START.md`](./QUICK_START.md)
