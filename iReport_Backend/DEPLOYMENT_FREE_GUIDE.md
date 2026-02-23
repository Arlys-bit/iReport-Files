# 🆓 FREE Deployment Step-by-Step Guide

**Total Setup Time: 30-45 minutes**  
**Cost: $0**

---

## 📋 TABLE OF CONTENTS
1. [Part 1: GitHub Setup](#part-1-github-setup)
2. [Part 2: Push Code to GitHub](#part-2-push-code-to-github)
3. [Part 3: MongoDB Atlas Setup](#part-3-mongodb-atlas-setup)
4. [Part 4: Replit Deployment](#part-4-replit-deployment)
5. [Part 5: Testing](#part-5-testing)
6. [Part 6: Use on Different Devices](#part-6-use-on-different-devices)

---

## PART 1: GitHub Setup

### Step 1.1: Create GitHub Account

**Time: 2 minutes**

1. Go to https://github.com
2. Click "Sign up"
3. Enter your email
4. Create a password
5. Choose username (e.g., `yourname123`)
6. Click "Create account"
7. Verify your email

✅ **Done! You have GitHub account**

---

### Step 1.2: Create a New Repository

**Time: 1 minute**

1. Click the **+** icon (top right)
2. Select "New repository"
3. Fill in:
   - **Repository name:** `iReport-backend`
   - **Description:** Backend API for iReport school management system
   - **Public** (select this)
   - Leave other options default
4. Click "Create repository"

✅ **Done! You have a GitHub repo**

---

## PART 2: Push Code to GitHub

### Step 2.1: Install Git (if not installed)

**Time: 2 minutes**

Check if Git is installed:
```bash
git --version
```

If you see a version number, ✅ you have Git  
If not, download from: https://git-scm.com/download/win

---

### Step 2.2: Configure Git (First Time Only)

**Time: 2 minutes**

Replace with YOUR info:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Example:
```bash
git config --global user.name "John Doe"
git config --global user.email "john@example.com"
```

✅ **Done! Git is configured**

---

### Step 2.3: Initialize Git in Your Project

**Time: 1 minute**

Open PowerShell in your iReport_Backend folder and run:

```bash
git init
```

You should see:
```
Initialized empty Git repository in C:\Users\Arl\Downloads\iReport_backend_version\iReport_Backend\.git
```

✅ **Done!**

---

### Step 2.4: Add All Files to Git

**Time: 1 minute**

```bash
git add .
```

This stages all your files for commit.

✅ **Done!**

---

### Step 2.5: Commit Your Code

**Time: 1 minute**

```bash
git commit -m "Initial commit - iReport backend"
```

You should see output like:
```
[main (root-commit) abc1234] Initial commit - iReport backend
 45 files changed, 2500 insertions(+)
```

✅ **Done!**

---

### Step 2.6: Connect to GitHub and Push

**Time: 3 minutes**

1. Go back to your GitHub repo page (https://github.com/yourusername/iReport-backend)
2. Click the green "Code" button
3. Copy the HTTPS URL (looks like: `https://github.com/yourusername/iReport-backend.git`)

In PowerShell, replace `YOUR_GITHUB_USERNAME` with your actual username and run:

```bash
git remote add origin https://github.com/Arlys-bit/iReport-Files.git
git branch -M main
git push -u origin main
```

**Your command is ready! Run it in PowerShell.**

---

### Step 2.7: Verify on GitHub

1. Go to https://github.com/YOUR_GITHUB_USERNAME/iReport-backend
2. Refresh the page
3. You should see all your files listed ✅

---

## PART 3: MongoDB Atlas Setup

### Step 3.1: Create MongoDB Account

**Time: 2 minutes**

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email/password
4. Verify your email
5. Answer setup questions (for school project)

✅ **Done!**

---

### Step 3.2: Create a Cluster

**Time: 5 minutes**

1. After login, click "Create" button
2. Choose **M0 Free** (it's already selected)
3. Choose Cloud Provider:
   - Select **AWS**
   - Select region closest to you
4. Click "Create Cluster"
5. Wait 2-3 minutes for cluster to be created

✅ **Done! Cluster is creating...**

---

### Step 3.3: Create Database User

**Time: 2 minutes**

1. Click "Security" in left menu
2. Click "Database Access" tab
3. Click "+ Add New Database User"
4. Enter:
   - **Username:** `ireport_user`
   - **Password:** Create a strong password (write it down!)
   - **Built-in Role:** Select "Atlas admin"
5. Click "Add User"

✅ **Done!**

Example credentials to save:
```
Username: ireport_user
Password: YourStrongPassword123!
```

---

### Step 3.4: Allow Network Access

**Time: 2 minutes**

1. Go to "Security" → "Network Access" tab
2. Click "+ Add IP Address"
3. Click "Allow Access from Anywhere"
4. Click "Confirm"

⚠️ **Note:** For school, this is fine. In production, lock it down.

✅ **Done!**

---

### Step 3.5: Get Connection String

**Time: 2 minutes**

1. Go back to "Overview" tab
2. Click "Clusters" in left menu
3. Find your cluster, click "Connect"
4. Select "Connect your application"
5. Choose **Node.js** and version **Latest**
6. Copy the connection string

It looks like:
```
mongodb+srv://ireport_user:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Replace `PASSWORD` with your actual password!**

Save this somewhere safe - you'll need it soon!

Example:
```
mongodb+srv://ireport_user:YourStrongPassword123!@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
```

✅ **Done!**

---

## PART 4: Replit Deployment

### Step 4.1: Create Replit Account

**Time: 2 minutes**

1. Go to https://replit.com
2. Click "Sign up"
3. Sign up with GitHub (easiest!)
   - Click "Sign up with GitHub"
   - Authorize Replit
4. Choose username

✅ **Done!**

---

### Step 4.2: Import Your GitHub Project

**Time: 3 minutes**

1. In Replit, click "+ New Replit"
2. Click "Import from GitHub"
3. In "GitHub URL" field, paste:
   ```
   https://github.com/YOUR_GITHUB_USERNAME/iReport-backend
   ```
   Replace with YOUR username!

4. Click "Import from GitHub"
5. Wait for import (2-3 minutes)

Replit will:
- Clone your repo ✅
- Auto-detect Node.js ✅
- Install dependencies ✅

✅ **Done!**

---

### Step 4.3: Add Environment Variables (Secrets)

**Time: 3 minutes**

1. In your Replit project, click the **🔒 Secrets** button (left sidebar)
2. Click "Add Secret"
3. Add each variable:

**Secret 1:**
- **Key:** `MONGODB_URI`
- **Value:** Your MongoDB connection string from Step 3.5
  ```
  mongodb+srv://ireport_user:YourStrongPassword123!@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
  ```
- Click "Add"

**Secret 2:**
- **Key:** `JWT_SECRET`
- **Value:** Generate a random secret
  ```
  your-super-secret-key-here-make-it-random-123456789
  ```
  (Make it long and random!)
- Click "Add"

**Secret 3:**
- **Key:** `NODE_ENV`
- **Value:** `production`
- Click "Add"

**Secret 4:**
- **Key:** `CORS_ORIGIN`
- **Value:** `https://yourreplit.replit.dev`
  (You'll get your actual URL after first run)
- Click "Add"

✅ **Done!**

---

### Step 4.4: Start Your Backend

**Time: 1 minute**

1. Click the green "Run" button (top)
2. Wait for startup (30-60 seconds)
3. You should see:
   ```
   Server is running on port 5000 in production mode
   MongoDB connected successfully
   ```

✅ **Your backend is LIVE!**

---

### Step 4.5: Get Your Live URL

**Time: 30 seconds**

1. Look at the top right where it says "Webview"
2. You should see a URL like:
   ```
   https://iReport-backend.YOUR_REPLIT_USERNAME.repl.co
   ```

**This is your live backend!**

Copy this URL and save it.

---

### Step 4.6: Update CORS_ORIGIN Secret

**Time: 1 minute**

1. Go back to "Secrets" 🔒
2. Edit the `CORS_ORIGIN` secret
3. Change value to your actual Replit URL:
   ```
   https://iReport-backend.YOUR_REPLIT_USERNAME.repl.co
   ```
4. Click "Run" again to restart with new settings

✅ **Done!**

---

## PART 5: Testing

### Step 5.1: Test Your API is Live

**Time: 2 minutes**

Open a new browser tab and go to:
```
https://iReport-backend.YOUR_REPLIT_USERNAME.repl.co/api/health
```

You should see:
```json
{
  "status": "Server is running",
  "timestamp": "2026-02-17T10:30:00.000Z",
  "env": "production"
}
```

✅ **It's WORKING!**

---

### Step 5.2: Test Registration Endpoint

**Time: 3 minutes**

Using Postman or similar tool:

1. **URL:** `https://YOUR_REPLIT_URL/api/auth/register`
2. **Method:** POST
3. **Headers:**
   ```
   Content-Type: application/json
   ```
4. **Body (JSON):**
   ```json
   {
     "name": "Admin User",
     "email": "admin@test.com",
     "password": "AdminPass123",
     "role": "admin"
   }
   ```
5. Click "Send"

Expected response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@test.com",
    "role": "admin"
  },
  "token": "eyJhbGc..."
}
```

✅ **Registration works!**

---

## PART 6: Use on Different Devices

### Option A: At Home (Your PC)

**To test locally:**

```bash
# In your iReport_Backend folder
npm start
```

Server runs at: `http://localhost:5000`

---

### Option B: At School (Friend's Laptop)

**Pull latest code:**

```bash
cd C:\Users\YourName\Downloads
git clone https://github.com/YOUR_USERNAME/iReport-backend.git
cd iReport-backend
npm install
npm start
```

Server runs locally at: `http://localhost:5000`

---

### Option C: Use Live Replit Version (Recommended)

**Your frontend uses:**

```typescript
const API_URL = 'https://iReport-backend.YOUR_USERNAME.repl.co/api';

// Example API call:
fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@test.com',
    password: 'AdminPass123'
  })
})
```

✅ **Works from ANY device, ANY location!**

---

### Updating Code From Different Devices

**On your PC at home:**

```bash
# Make changes to code
# Then push to GitHub:
git add .
git commit -m "Added new feature"
git push origin main
```

✅ **Replit automatically redeploys!** (wait 1-2 minutes)

**On friend's laptop at school:**

```bash
# Pull latest changes
git pull origin main

# Test locally
npm start

# Make your changes
# Then push
git add .
git commit -m "School changes"
git push origin main
```

✅ **Everyone sees the latest version!**

---

## 🎯 SUMMARY

You now have:

✅ Code backup on GitHub (`iReport-backend` repo)  
✅ Live backend on Replit (always running)  
✅ Cloud database on MongoDB Atlas (free tier)  
✅ API accessible from anywhere  
✅ Easy code sync between devices  

---

## 📱 For Your Mobile App

Update your React Native app to use:

```typescript
const API_URL = 'https://iReport-backend.YOUR_USERNAME.repl.co/api';

// All endpoints work:
// POST /auth/register
// POST /auth/login
// GET /students
// POST /reports
// etc.
```

---

## 🔐 Important Security Notes

✅ Keep your `MONGODB_URI` secret (it contains password)  
✅ Keep your `JWT_SECRET` secret  
✅ Never commit `.env` to GitHub (already in `.gitignore`)  
✅ Use weak passwords only for development/school projects  

---

## 💡 Troubleshooting

**Backend won't start on Replit:**
- Check Replit console for errors
- Verify all environment variables are set
- Click "Run" again

**Can't connect to MongoDB:**
- Check `MONGODB_URI` is correct
- Verify MongoDB Atlas cluster is not paused
- Check network access is "Allow from Anywhere"

**Git push rejected:**
- Make sure you're in correct folder: `iReport_Backend`
- Run: `git status` to see what's pending
- Add and commit: `git add . && git commit -m "message"`

**Can't clone on other device:**
- Make sure repo is public
- Use: `git clone https://github.com/YOUR_USERNAME/iReport-backend.git`

---

## ✅ All Done!

You now have a **FREE, production-ready backend** that:
- Runs in the cloud ☁️
- Works on any device 💻
- Has database backup 💾
- Is version controlled 📦
- Can be updated from anywhere 🌍

**Total cost: $0**

Good luck with your school project! 🚀
