# GigFlow Production Deployment Checklist

## ✅ Pre-Deployment Verification

### Backend Configuration
- [x] CORS configured to read from `CLIENT_URL` environment variable
- [x] Socket.io CORS configured to read from `CLIENT_URL` environment variable
- [x] PORT can be set via environment variable (defaults to 5000)
- [x] NODE_ENV set to 'production' for deployment
- [x] JWT_SECRET is strong and unique (changed from default)
- [x] MongoDB URI properly configured in environment variables
- [x] `.env` file added to `.gitignore` (secrets not committed)
- [x] Error handling and logging in place

### Frontend Configuration
- [x] API client reads `VITE_API_URL` from environment variables
- [x] Vite config supports environment variables for proxy
- [x] Build script: `npm run build` configured
- [x] Socket.io client connects to correct backend URL
- [x] Redux store properly configured
- [x] Authentication flows working (login, logout, protected routes)

### Repository Setup
- [x] `.gitignore` configured for all folders
- [x] `.env.example` files created (safe to commit)
- [x] Sensitive data removed from `.env` files
- [x] Code ready for GitHub push

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** gigflow-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or upgrade as needed)

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<generate-a-new-strong-secret>
   JWT_EXPIRE=7d
   CLIENT_URL=https://gigflow-frontend-lcjv.onrender.com
   ```

6. Click "Create Web Service"
7. Wait for deployment to complete
8. Note the backend URL (e.g., https://gigflow-api-b177.onrender.com)

### Step 3: Deploy Frontend to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Static Site"
3. Connect your GitHub repository (same one)
4. Configure:
   - **Name:** gigflow-frontend
   - **Build Command:** `npm install && npm run build` (for client directory)
   - **Publish Directory:** `dist`

5. Add Environment Variables:
   ```
   VITE_API_URL=https://gigflow-api-b177.onrender.com/api
   ```

6. Click "Create Static Site"
7. Wait for deployment to complete

### Step 4: Verification

1. Test Backend Health:
   ```
   curl https://gigflow-api-b177.onrender.com/api/health
   ```
   Should return: `{"success": true, "message": "GigFlow API is running 🚀"}`

2. Test Frontend:
   - Visit https://gigflow-frontend-lcjv.onrender.com
   - Verify page loads without console errors
   - Check that logo and navbar are visible

3. Test Authentication:
   - Try to register a new user
   - Try to login
   - Check browser cookies for JWT token

4. Test API Connectivity:
   - Post a gig
   - Browse gigs
   - Submit a bid
   - Test real-time notifications

## 🔧 Troubleshooting

### Backend Issues

**Error: "CORS error on production"**
- Solution: Verify `CLIENT_URL` environment variable is set correctly in Render dashboard
- Make sure URLs don't have trailing slashes

**Error: "Cannot connect to MongoDB"**
- Solution: Verify `MONGODB_URI` is correct and network access is allowed
- Check MongoDB Atlas IP whitelist includes Render's IP

**Error: "JWT token not working"**
- Solution: Ensure `JWT_SECRET` is set and consistent
- Clear browser cookies and re-login

### Frontend Issues

**Error: "API calls returning 404"**
- Solution: Verify `VITE_API_URL` environment variable is set in Render
- Check that API URL includes `/api` at the end
- Example: `https://gigflow-api-b177.onrender.com/api`

**Error: "Socket.io not connecting"**
- Solution: Backend CORS must allow frontend URL
- Check browser network tab for socket connection attempt

**Error: "Static files not loading (CSS, JS)"**
- Solution: Ensure build completed successfully
- Check that Publish Directory is set to `dist`

## 📊 Environment Variables Reference

### Server (.env)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<strong-secret-key>
JWT_EXPIRE=7d
CLIENT_URL=https://gigflow-frontend-lcjv.onrender.com
```

### Client (.env.production.local or Render env vars)
```
VITE_API_URL=https://gigflow-api-b177.onrender.com/api
```

## 🔐 Security Checklist

- [ ] Never commit `.env` files with real secrets
- [ ] Use `.env.example` files for reference
- [ ] Generate new JWT_SECRET for production
- [ ] Enable HTTPS on Render (automatic)
- [ ] Use strong database password
- [ ] Limit MongoDB network access to Render IP
- [ ] Keep dependencies updated
- [ ] Enable CORS only for allowed origins
- [ ] Use HttpOnly cookies for JWT tokens

## 📝 Notes

- Both frontend and backend should be deployed to Render for consistency
- Free tier on Render will spin down after inactivity - consider upgrading for production
- Monitor Render dashboard for build errors and deployment logs
- Set up email notifications for deployment failures
- Test thoroughly on staging before going live

## ✅ Final Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed and responding to health check
- [ ] Frontend deployed and loading without errors
- [ ] Login/Registration working
- [ ] Gig posting working
- [ ] Bidding system working
- [ ] Real-time notifications working
- [ ] CORS errors resolved
- [ ] Socket.io connections established
- [ ] No console errors in browser
- [ ] No errors in backend logs
