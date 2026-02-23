# iReport Backend - Deployment & Setup Guide

## Quick Start (Development)

### 1. Install Dependencies
```bash
cd iReport_Backend
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env
```

### 3. Configure MongoDB

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# Then update .env:
MONGODB_URI=mongodb://localhost:27017/ireport
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/free
2. Create free cluster
3. Get connection string
4. Update `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ireport
```

### 4. Generate JWT Secret
```bash
# Generate a strong secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to `.env`:
```
JWT_SECRET=<paste-the-generated-string>
```

### 5. Update .env File
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ireport
JWT_SECRET=your_generated_secret_here
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 6. Start Development Server
```bash
npm run dev
```

You should see:
```
Server is running on port 5000 in development mode
MongoDB connected successfully
```

Test the API:
```bash
curl http://localhost:5000/api/health
```

---

## Building for Production

### 1. Compile TypeScript
```bash
npm run build
```

Creates `dist/` folder with compiled JavaScript.

### 2. Update Production .env
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ireport
JWT_SECRET=<your-strong-secret>
JWT_EXPIRE=7d
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

### 3. Start Production Server
```bash
npm start
```

Or use process manager:
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start dist/index.js --name "ireport-api"

# Monitor
pm2 monit

# View logs
pm2 logs ireport-api

# Save PM2 config to restart on reboot
pm2 startup
pm2 save
```

---

## Deploying to Cloud

### Option 1: Heroku

1. Install Heroku CLI
```bash
# Visit https://devcenter.heroku.com/articles/heroku-cli
```

2. Login
```bash
heroku login
```

3. Create app
```bash
heroku create your-app-name
```

4. Set environment variables
```bash
heroku config:set JWT_SECRET="your-secret"
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN="https://your-frontend.com"
```

5. Deploy
```bash
git push heroku main
```

6. View logs
```bash
heroku logs --tail
```

### Option 2: Railway

1. Sign up at https://railway.app
2. Create new project
3. Connect GitHub repository
4. Add environment variables in dashboard
5. Deploy (automatic on Git push)

### Option 3: AWS

Use EC2 or Elastic Beanstalk:
1. Create EC2 instance (Ubuntu 20.04+)
2. Install Node.js, npm, MongoDB
3. Clone repository
4. Install dependencies: `npm install`
5. Build: `npm run build`
6. Start: `npm start`

---

## API Endpoints Summary

### Authentication
```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile (requires token)
PUT /api/auth/profile (requires token)
```

### Students
```
GET /api/students
GET /api/students/:id
GET /api/students/class/:className
POST /api/students (admin only)
PUT /api/students/:id (admin only)
DELETE /api/students/:id (admin only)
```

### Reports
```
GET /api/reports
GET /api/reports/:id
POST /api/reports
PUT /api/reports/:id
POST /api/reports/:id/comments
DELETE /api/reports/:id (admin only)
GET /api/reports/live/all
POST /api/reports/live/create
PUT /api/reports/live/:id
```

### Buildings
```
GET /api/buildings
GET /api/buildings/:id
POST /api/buildings (admin only)
PUT /api/buildings/:id (admin only)
DELETE /api/buildings/:id (admin only)
POST /api/buildings/:id/rooms (admin only)
```

---

## Example API Requests

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "role": "admin"
  }'
```

Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Get Profile (with token)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Students
```bash
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Troubleshooting

### Port Already in Use
```bash
# Change in .env
PORT=5001
```

### MongoDB Connection Failed
1. Check MongoDB is running
2. Check MONGODB_URI is correct
3. Check network access (if using MongoDB Atlas)
4. Check username/password

### JWT Errors
```
Invalid token
```
- Token may be expired
- Token may be malformed
- JWT_SECRET may have changed

### CORS Errors
- Update CORS_ORIGIN in .env
- For development: `CORS_ORIGIN=http://localhost:3000`
- For production: `CORS_ORIGIN=https://yourdomain.com`

### Rate Limiting Blocked My Requests
- Default: 5 auth attempts per 15 minutes
- Default: 100 general requests per 15 minutes
- Wait 15 minutes or change limits in `src/index.ts`

---

## Environment Variables Reference

| Variable | Default | Required | Example |
|----------|---------|----------|---------|
| PORT | 5000 | No | 5000 |
| MONGODB_URI | mongodb://localhost:27017/ireport | Yes | mongo+srv://user:pass@cluster.mongodb.net/ireport |
| JWT_SECRET | (none) | Yes | abc123def456... |
| JWT_EXPIRE | 7d | No | 7d, 24h, 30d |
| NODE_ENV | development | No | production, development |
| CORS_ORIGIN | http://localhost:3000 | No | https://yourdomain.com |

---

## Monitoring & Logs

### View Logs
```bash
# Development (from npm run dev)
# Shows all console.log output

# Production with PM2
pm2 logs ireport-api

# Check errors
tail -f logs/error.log
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "Server is running",
  "timestamp": "2026-02-15T10:30:00.000Z",
  "env": "development"
}
```

---

## Security Checklist Before Production

- [ ] JWT_SECRET is strong (32+ characters, random)
- [ ] MONGODB_URI is not exposed in code
- [ ] NODE_ENV is set to "production"
- [ ] CORS_ORIGIN is set to your frontend domain
- [ ] Database backups are configured
- [ ] Rate limiting is appropriate for your scale
- [ ] Error logs don't expose stack traces
- [ ] HTTPS is enabled (in proxy/CDN)
- [ ] Database credentials are strong
- [ ] All dependencies are up to date

---

## Performance Tips

1. **Add database indexes** - Already set for email uniqueness
2. **Enable compression** - Add in package.json soon
3. **Use CDN** - For frontend assets
4. **Monitor response times** - Use APM tools
5. **Scale horizontally** - Use load balancer when needed
6. **Cache frequently accessed data** - Consider Redis

---

## Getting Help

- Check logs for errors
- Verify all environment variables are set
- Ensure MongoDB is accessible
- Check firewall rules (if applicable)
- Review CODE_REVIEW.md for detailed information

Good luck with your deployment! 🚀
