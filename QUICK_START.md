# Quick Start Guide - GigFlow

## 🚀 For Local Development

```bash
# Terminal 1 - Backend
cd server
npm install
cp .env.example .env
# Edit .env with MongoDB URI and set a JWT_SECRET
npm run dev

# Terminal 2 - Frontend  
cd client
npm install
npm run dev
```

Then open: http://localhost:5173

## 🌐 For Production Deployment on Render

### Step 1: Update GitHub
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

### Step 2: Deploy Backend
- Go to Render.com → Create Web Service
- Connect your GitHub repo
- Set environment variables:
  - `NODE_ENV=production`
  - `MONGODB_URI=<your-mongodb-uri>`
  - `JWT_SECRET=<strong-secret>`
  - `CLIENT_URL=https://your-frontend-domain.com`
  - `PORT=10000`

### Step 3: Deploy Frontend
- Go to Render.com → Create Static Site
- Connect your GitHub repo
- Set build command: `npm install && npm run build`
- Set publish directory: `dist`
- Set environment variable: `VITE_API_URL=https://your-backend-domain.com/api`

### Step 4: Test
```bash
# Test backend health
curl https://your-backend-domain.com/api/health

# Visit frontend
https://your-frontend-domain.com
```

## 📋 Key Configuration Files Updated

| File | Change | Purpose |
|------|--------|---------|
| `server/server.js` | CORS & Socket.io read from `CLIENT_URL` env var | Production-ready |
| `client/src/services/api.js` | Reads `VITE_API_URL` env var | Works in dev & production |
| `client/vite.config.js` | Proxy uses env vars | Flexible configuration |
| `.gitignore` | Added `.env` | Secrets not committed |
| `.env.example` | Created reference files | Safe to commit |
| `DEPLOYMENT.md` | Complete deployment guide | Step-by-step instructions |
| `LOCAL_SETUP.md` | Local dev setup | For developers |

## ⚠️ Important Notes

1. **Never commit `.env` file** - Only commit `.env.example`
2. **Change JWT_SECRET** for production - Don't use default values
3. **Update CLIENT_URL** in production env vars after deployment
4. **Verify CORS** - Check browser console for CORS errors
5. **Test Socket.io** - Verify real-time notifications work

## 🔍 Troubleshooting

| Problem | Solution |
|---------|----------|
| CORS error | Check `CLIENT_URL` env var matches frontend domain |
| Socket.io not connecting | Verify backend CORS includes frontend URL |
| 404 on API calls | Check `VITE_API_URL` ends with `/api` |
| JWT not working | Ensure `JWT_SECRET` is set and consistent |
| Build fails on Render | Check `npm run build` works locally first |

## 📚 Documentation

- **Full Deployment Guide**: See `DEPLOYMENT.md`
- **Local Setup Details**: See `LOCAL_SETUP.md`
- **Project Overview**: See `README.md`

## ✅ Pre-Deployment Checklist

- [ ] Push code to GitHub
- [ ] Test backend locally: `npm run dev` in server/
- [ ] Test frontend locally: `npm run dev` in client/
- [ ] Login/Register works
- [ ] Gig posting works
- [ ] Bidding works
- [ ] Real-time notifications work
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Render
- [ ] Test on deployed URLs
- [ ] No console errors in browser
- [ ] No errors in backend logs

## 🎯 Next Steps

1. Read `LOCAL_SETUP.md` for detailed local dev instructions
2. Test everything locally first
3. When ready, follow `DEPLOYMENT.md` for production
4. Check `render.yaml` for infrastructure-as-code deployment option
