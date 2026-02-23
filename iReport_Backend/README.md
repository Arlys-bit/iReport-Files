# iReport Backend API

A complete backend API for the iReport school management system built with Node.js, Express, MongoDB, and TypeScript.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Student Management**: Create, read, update, and delete student records
- **Report Management**: Handle academic, behavioral, incident, and health reports
- **Live Reports**: Real-time incident and emergency reporting
- **Building Management**: Manage school buildings and rooms
- **Role-Based Access Control**: Support for admin, teacher, student, and staff roles

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Language**: TypeScript
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository:
```bash
cd iReport_Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and JWT secret:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ireport
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (authenticated)
- `PUT /api/auth/profile` - Update user profile (authenticated)

### Students
- `GET /api/students` - Get all students (authenticated)
- `GET /api/students/:id` - Get student by ID
- `GET /api/students/class/:className` - Get students by class
- `POST /api/students` - Create new student (admin only)
- `PUT /api/students/:id` - Update student (admin only)
- `DELETE /api/students/:id` - Delete student (admin only)

### Reports
- `GET /api/reports` - Get all reports (with filters)
- `GET /api/reports/:id` - Get report by ID
- `POST /api/reports` - Create new report
- `PUT /api/reports/:id` - Update report
- `POST /api/reports/:id/comments` - Add comment to report
- `DELETE /api/reports/:id` - Delete report

### Live Reports
- `GET /api/reports/live/all` - Get all live reports
- `POST /api/reports/live/create` - Create live report
- `PUT /api/reports/live/:id` - Update live report

### Buildings
- `GET /api/buildings` - Get all buildings
- `GET /api/buildings/:id` - Get building by ID
- `POST /api/buildings` - Create building (admin only)
- `PUT /api/buildings/:id` - Update building (admin only)
- `DELETE /api/buildings/:id` - Delete building (admin only)
- `POST /api/buildings/:id/rooms` - Add room to building (admin only)

## Authentication

The API uses JWT for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Role-Based Access Control (RBAC)

- **Admin**: Full access to all endpoints
- **Teacher**: Can create reports, view students, manage comments
- **Student**: Can view own profile and reports
- **Staff**: Can view reports and student information

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message here"
}
```

## Directory Structure

```
src/
├── config/          # Configuration files (database, JWT)
├── controllers/     # Request handlers for routes
├── middleware/      # Express middleware (auth, error handling)
├── models/          # MongoDB schemas
├── routes/          # API route definitions
├── utils/           # Utility functions (JWT, passwords, errors)
└── index.ts         # Application entry point
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRE` - JWT token expiration time
- `NODE_ENV` - Environment (development/production)

## Future Enhancements

- [ ] File upload support for report attachments
- [ ] Email notifications
- [ ] Advanced reporting and analytics
- [ ] Real-time notifications with Socket.io
- [ ] Two-factor authentication
- [ ] Rate limiting
- [ ] API documentation with Swagger

## License

ISC
