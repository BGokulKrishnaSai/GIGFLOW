# 🚀 GigFlow - Production Deployment Checklist

## Phase 1: Pre-Deployment Review ✅

### Code Configuration
- [x] CORS updated to read from `CLIENT_URL` env variable
- [x] Socket.io updated to read from `CLIENT_URL` env variable
- [x] Client API client reads `VITE_API_URL` env variable
- [x] Vite proxy configured with environment variables
- [x] All hardcoded localhost URLs removed from config
- [x] Environment logging added for debugging

### Files & Security
- [x] `.env` added to `.gitignore` (all directories)
- [x] `.env.example` created (safe to commit)
- [x] No secrets in code repository
- [x] JWT_SECRET template documented
- [x] MONGODB_URI template documented

### Documentation
- [x] `QUICK_START.md` - One-page reference
- [x] `LOCAL_SETUP.md` - Local development guide
- [x] `DEPLOYMENT.md` - Production deployment guide
- [x] `GETTING_STARTED.md` - GitHub README
- [x] `CHANGES_SUMMARY.md` - Changes documentation
- [x] `render.yaml` - Infrastructure config
- [x] `.github/workflows/deploy.yml` - CI/CD template

---

## Phase 2: Local Testing ⏳

### Before Pushing to GitHub

**Terminal 1 - Backend:**
```bash
cd server
npm install
cp .env.example .env

# Edit .env with:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
# - CLIENT_URL=http://localhost:5173 (for local testing)

npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
Setting up CORS...
Allowed CORS origins: ["http://localhost:5173","http://localhost:5174"]
Socket.io CORS origins: ["http://localhost:5173","http://localhost:5174"]
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm run dev
```

**Expected Output:**
```
VITE v5.0.0  ready in 123 ms

➜  Local:   http://localhost:5173/
```

### Local Testing Steps

- [ ] Open http://localhost:5173
- [ ] Register a new user
- [ ] Login successfully
- [ ] Post a gig
- [ ] Open incognito window and create another user
- [ ] Browse gigs and place a bid
- [ ] Go back to main account
- [ ] Hire the freelancer
- [ ] Check for real-time notification in freelancer's window
- [ ] No CORS errors in browser console
- [ ] No errors in backend terminal
- [ ] Check Network tab shows Socket.io connection

---

## Phase 3: GitHub Push 📤

```bash
# From project root
git add .
git commit -m "Production-ready: Updated CORS, Socket.io, and API client for environment variables"
git push origin main
```

**Verify on GitHub:**
- [ ] Code is on GitHub
- [ ] `.env` file NOT visible (should be in .gitignore)
- [ ] `.env.example` files ARE visible
- [ ] All documentation files visible

---

## Phase 4: Deploy Backend to Render 🚀

### Create Backend Service

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Select your GitHub repo
4. Configure:
   - **Name:** `gigflow-backend` (or your preference)
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (upgrade if needed)
   - **Root Directory:** `server` (IMPORTANT)

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=<paste-your-mongodb-connection-string>
   JWT_SECRET=<generate-new-secret>
   JWT_EXPIRE=7d
   CLIENT_URL=https://gigflow-frontend-lcjv.onrender.com
   ```

   To generate JWT_SECRET:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)

### Verify Backend Deployment

**After deployment completes:**

```bash
# Replace with your actual backend URL
BACKEND_URL="https://gigflow-api-b177.onrender.com"

# Test health endpoint
curl $BACKEND_URL/api/health

# Expected response:
# {"success":true,"message":"GigFlow API is running 🚀","timestamp":"2024-01-13T..."}
```

**Check logs in Render dashboard:**
- Should show "Server running on port 10000"
- Should show "Allowed CORS origins: [...]"
- Should show "Socket.io CORS origins: [...]"

---

## Phase 5: Deploy Frontend to Render 🎨

### Create Frontend Service

1. Go to https://dashboard.render.com
2. Click "New +" → "Static Site"
3. Select your GitHub repo
4. Configure:
   - **Name:** `gigflow-frontend` (or your preference)
   - **Build Command:** `npm install && npm run build` (with `cd client` prefix if needed)
   - **Publish Directory:** `client/dist` (or just `dist` if root is `client`)
   - **Plan:** Free

5. Add Environment Variables:
   ```
   VITE_API_URL=https://gigflow-api-b177.onrender.com/api
   ```

6. Click "Create Static Site"
7. Wait for deployment (3-5 minutes)

### Verify Frontend Deployment

**After deployment completes:**

```bash
# Replace with your actual frontend URL
FRONTEND_URL="https://gigflow-frontend-lcjv.onrender.com"

# Just visit it in browser
# Check:
# - Page loads without errors
# - Logo and navbar are visible
# - No red errors in browser console
```

**Common Issues & Fixes:**

| Issue | Fix |
|-------|-----|
| Build fails | Check `npm run build` works locally first |
| 404 errors | Verify Build/Publish directories in Render |
| API not connecting | Check `VITE_API_URL` is set correctly |
| Static files not loading | Clear browser cache, hard refresh (Ctrl+Shift+R) |

---

## Phase 6: End-to-End Testing 🧪

### Frontend Tests

- [ ] Visit frontend URL in browser
- [ ] Page loads (no 404)
- [ ] Navbar visible
- [ ] No console errors (DevTools F12)
- [ ] Hard refresh works (Ctrl+Shift+R)

### Authentication Tests

- [ ] Click "Register"
- [ ] Fill form and submit
- [ ] Redirected to home or login
- [ ] Can login with credentials
- [ ] JWT token in cookies (DevTools → Application → Cookies)
- [ ] Can logout
- [ ] Redirect to login works

### Gig & Bid Tests

- [ ] Login with first account
- [ ] Click "Post Gig"
- [ ] Fill gig details and submit
- [ ] Redirected back
- [ ] Can see gig on home page
- [ ] Open new incognito window
- [ ] Register second account
- [ ] Find the gig
- [ ] Click gig and submit bid
- [ ] Bid appears in "My Bids"

### Real-time Notification Tests

- [ ] In first account: Go to "My Gigs"
- [ ] Click the gig to see bids
- [ ] Click "Hire" on a bid
- [ ] In second account (incognito): Should see notification (if not, check browser console)
- [ ] Check backend logs for Socket.io activity

### CORS & API Tests

- [ ] No CORS errors in browser console
- [ ] All API calls successful (check Network tab)
- [ ] No 401 Unauthorized errors (unless expected)
- [ ] Images/assets load properly

---

## Phase 7: Monitoring & Troubleshooting 🔍

### Check Logs

**Backend (Render Dashboard):**
- Click service → Logs
- Look for "Server running"
- Look for "Allowed CORS origins"
- Check for errors

**Frontend (Render Dashboard):**
- Click service → Logs
- Look for build success
- Check for build errors

### Browser Console

**Open browser DevTools (F12):**
- Console tab: Check for red errors
- Network tab: Check API responses
- Application tab: Check JWT cookie

### Test API Endpoints

```bash
BACKEND="https://gigflow-api-b177.onrender.com"

# Health check
curl $BACKEND/api/health

# Get all gigs
curl $BACKEND/api/gigs

# Try login (should work)
curl -X POST $BACKEND/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}'
# Should return error (not CORS error)
```

---

## Phase 8: Troubleshooting Common Issues ❌➜✅

### CORS Errors
```
Access to XMLHttpRequest at 'https://gigflow-api...' from origin 
'https://gigflow-frontend...' has been blocked by CORS policy
```

**Fix:**
1. In Render backend dashboard
2. Environment variables
3. Update `CLIENT_URL` to match frontend URL exactly
4. Redeploy backend

---

### Socket.io Not Connecting
**Symptom:** Browser shows "Socket.io connection failed"

**Fix:**
1. Verify `CLIENT_URL` includes frontend URL
2. Check backend logs for Socket.io CORS origins
3. Verify frontend URL is in the list
4. Hard refresh browser (Ctrl+Shift+R)

---

### API Returns 404
**Symptom:** "Cannot POST /api/auth/login"

**Fix:**
1. Verify backend is deployed and running
2. Check `VITE_API_URL` in frontend env vars
3. Make sure URL includes `/api`
4. Example: `https://gigflow-api-b177.onrender.com/api`

---

### "Failed to build" on Render

**Check:**
1. Run `npm run build` locally in client directory
2. Verify it creates `dist/` folder
3. Check error logs in Render
4. Ensure all dependencies installed

---

### JWT Token Not Working
**Symptom:** "401 Unauthorized" on requests

**Fix:**
1. Clear browser cookies
2. Clear browser local storage
3. Logout and login again
4. Verify JWT_SECRET is set on backend

---

## Phase 9: Post-Deployment Monitoring 📊

### Set Up Alerts
- [ ] Email alerts for build failures
- [ ] Email alerts for service crashes
- [ ] Monitor backend memory/CPU usage
- [ ] Monitor error rates

### Regular Checks
- [ ] Monitor error logs daily
- [ ] Check performance metrics weekly
- [ ] Verify HTTPS is working
- [ ] Test critical user flows weekly

---

## ✅ Final Verification Checklist

- [ ] Backend deployed and health check passes
- [ ] Frontend deployed and loads without errors
- [ ] CORS errors resolved
- [ ] Socket.io connections established
- [ ] User registration works
- [ ] User login works
- [ ] Gig posting works
- [ ] Bidding works
- [ ] Hiring works
- [ ] Real-time notifications work
- [ ] No console errors in browser
- [ ] No errors in backend logs
- [ ] Database connected successfully
- [ ] All environment variables set correctly
- [ ] JWT tokens working
- [ ] Cookies being set/read correctly

---

## 🎉 Deployment Complete!

Your GigFlow application is now live in production!

**Quick Links:**
- Frontend: https://gigflow-frontend-lcjv.onrender.com
- Backend: https://gigflow-api-b177.onrender.com
- Render Dashboard: https://dashboard.render.com

---

## 📞 Support & Resources

- **Issues?** Check `DEPLOYMENT.md` troubleshooting section
- **Setup?** See `LOCAL_SETUP.md`
- **Quick reference?** See `QUICK_START.md`
- **Full docs?** See `README.md`

---

**Last Updated:** January 13, 2026
**Status:** Ready for Production Deployment ✅
