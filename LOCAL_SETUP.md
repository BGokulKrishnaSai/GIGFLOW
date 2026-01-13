# GigFlow - Local Development Setup

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)
- Git

## Project Structure

```
GigFlow/
├── server/           # Express backend
├── client/           # React frontend
├── DEPLOYMENT.md     # Production deployment guide
└── README.md         # Project documentation
```

## Local Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd GigFlow
```

### 2. Setup Backend

```bash
cd server

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your MongoDB credentials
# Update these values:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: Generate a random secret (e.g., run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Setup Frontend

Open a new terminal window:

```bash
cd client

# Install dependencies
npm install

# Create .env file from example (optional for local dev)
cp .env.example .env.local

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## Testing the Application

### 1. Register a New User

- Go to `http://localhost:5173`
- Click on "Register"
- Fill in the form and submit
- You'll be redirected to the home page

### 2. Test Gig Posting (as Client)

- Once logged in, click "Post Gig"
- Fill in gig details:
  - Title
  - Description
  - Budget
  - Category
  - Duration
- Submit to create the gig

### 3. Test Bidding (as Freelancer)

- Open an incognito window and create another account
- Login as the freelancer
- Browse gigs on the home page
- Click on a gig and submit a bid with:
  - Bid amount
  - Message to the client
- The freelancer will see the bid in "My Bids"

### 4. Test Hiring & Notifications

- Switch back to the client's window
- Go to "My Gigs"
- Click on the gig to see bids
- Click "Hire" on a specific bid
- The freelancer should receive a real-time notification

## Available Scripts

### Server
```bash
npm run dev     # Start with nodemon (auto-restart on changes)
npm start       # Start production server
```

### Client
```bash
npm run dev     # Start Vite dev server
npm run build   # Build for production (creates dist/ folder)
npm run preview # Preview production build locally
```

## Environment Variables

### Server (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<generate-a-secret>
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### Client (.env.local)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=GigFlow
VITE_APP_VERSION=1.0.0
```

## Troubleshooting

### Backend won't start
- Check if port 5000 is already in use: `lsof -i :5000` (Mac/Linux) or `netstat -ano | findstr :5000` (Windows)
- Verify MongoDB connection string is correct
- Ensure MONGODB_URI starts with `mongodb+srv://`

### Frontend won't start
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`
- Ensure backend is running on port 5000

### API calls failing with 401
- Check if JWT token is in cookies
- Try logging out and back in
- Check browser DevTools Network tab for Authorization header

### Socket.io not connecting
- Ensure backend is running
- Check browser console for socket connection errors
- Verify CORS is allowing the frontend URL

### CORS errors
- Ensure `CLIENT_URL` environment variable is set correctly
- Make sure URLs match exactly (no trailing slashes, correct protocol)

## Database Setup

### Using MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Whitelist your IP address
5. Create a database user
6. Get the connection string
7. Update `MONGODB_URI` in your `.env` file

Connection string format:
```
mongodb+srv://username:password@cluster0.xxx.mongodb.net/?appName=GigFlow
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete production deployment instructions.

## Testing Tips

- Use different browsers or incognito windows to test multi-user scenarios
- Check browser DevTools (F12) for:
  - Console errors
  - Network requests
  - Application > Cookies (for JWT tokens)
  - Socket.io connection in Network tab
- Monitor backend logs in terminal for any errors
- Use MongoDB Atlas UI to verify data is being stored correctly

## Common Development Tasks

### Reset Database
```bash
# In MongoDB Atlas, delete all documents from collections
# Or use mongosh CLI to connect and drop collections
```

### View Real-time Logs
```bash
# Backend logs (with npm run dev)
# Already shows in terminal

# Frontend logs
# Check browser console (F12)
```

### Debug API Calls
```bash
# 1. Check Network tab in browser DevTools
# 2. Look at request/response headers
# 3. Check the response body for error messages
```

## Next Steps

1. Read the main [README.md](./README.md) for project overview
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) when ready to deploy
3. Check individual component files for implementation details
4. Explore the MongoDB data models in `server/models/`

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console errors
3. Check backend terminal logs
4. Verify environment variables are set correctly
