# ⚡ Quick Reference - Copy/Paste Commands

Use this for quick reference while following the guide.

---

## 🔧 Part 2: Push Code to GitHub

### Check Git Version
```bash
git --version
```

### Configure Git (First Time)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Initialize Git in Your Project
```bash
git init
```

### Add All Files
```bash
git add .
```

### Commit Code
```bash
git commit -m "Initial commit - iReport backend"
```

### Connect to GitHub (Replace YOUR_USERNAME)
```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/iReport-backend.git
git branch -M main
git push -u origin main
```

---

## 🗄️ Part 3: MongoDB Connection String

**Keep this format - replace PASSWORD:**

```
mongodb+srv://ireport_user:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Example:**
```
mongodb+srv://ireport_user:MyPassword123!@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
```

---

## 🚀 Part 4: Replit Secrets to Add

Add these in Replit's Secrets 🔒:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB connection string from Part 3 |
| `JWT_SECRET` | `your-super-random-secret-key-123456` |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | `https://iReport-backend.YOUR_USERNAME.repl.co` |

---

## ✅ Part 5: Test Your API

### Health Check
```
GET https://iReport-backend.YOUR_USERNAME.repl.co/api/health
```

Should return:
```json
{
  "status": "Server is running",
  "timestamp": "...",
  "env": "production"
}
```

### Register User (Postman)
```
POST https://iReport-backend.YOUR_USERNAME.repl.co/api/auth/register

Body (JSON):
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "AdminPass123",
  "role": "admin"
}
```

---

## 🔄 Part 6: Working on Different Devices

### Push Changes (At Home)
```bash
git add .
git commit -m "Your message"
git push origin main
```

### Pull Changes (At School)
```bash
git clone https://github.com/YOUR_USERNAME/iReport-backend.git
cd iReport-backend
npm install
npm start
```

### Update Changes (At School)
```bash
git pull origin main
npm start
```

---

## 📱 For Your Mobile App

Use this API URL in your React Native code:

```typescript
const API_URL = 'https://iReport-backend.YOUR_USERNAME.repl.co/api';

// Example
fetch(`${API_URL}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@test.com',
    password: 'TestPass123',
    role: 'student'
  })
})
```

---

## 🎯 API Endpoints

All endpoints require token in Authorization header (except register/login):

```
Authorization: Bearer YOUR_TOKEN_HERE
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update profile |
| GET | `/api/students` | Get all students |
| POST | `/api/students` | Create student (admin) |
| GET | `/api/reports` | Get all reports |
| POST | `/api/reports` | Create report |
| GET | `/api/buildings` | Get all buildings |

---

## 🆘 Quick Troubleshooting

**Backend won't start?**
- Check Replit console for error messages
- Verify MONGODB_URI secret is set correctly
- Click "Run" button again

**Can't push to GitHub?**
```bash
git status  # See what's pending
git add .
git commit -m "message"
git push origin main
```

**Can't clone on other device?**
```bash
git clone https://github.com/YOUR_USERNAME/iReport-backend.git
cd iReport-backend
npm install
```

**Forgot MongoDB password?**
- Go to MongoDB Atlas > Security > Database Access
- Create new user with new password

**Changed code but Replit not updating?**
- Click "Run" button to restart server
- Wait 1-2 minutes for redeploy

---

## 📝 Keep These Safe

Save these somewhere:

```
GitHub Username: ___________________
GitHub Password: ___________________

MongoDB Username: ireport_user
MongoDB Password: ___________________
MongoDB URI: ___________________

JWT Secret: ___________________

Replit URL: https://iReport-backend.YOUR_USERNAME.repl.co
```

---

**Good luck! You're deploying a free, production-ready backend! 🚀**
