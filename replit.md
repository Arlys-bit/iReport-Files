# iReport (IWitness) - School Incident Reporting System

## Overview

iReport (also called IWitness) is a school management and bullying/incident reporting system with two main parts:

1. **Mobile/Web Frontend** (`iReport/iReport/`) — An Expo (React Native) app built with the Rork platform that allows students to report bullying incidents, and staff/admin to manage students, staff, buildings, and review reports. Supports iOS, Android, and web.

2. **Backend API** (`iReport_Backend/`) — A Node.js/Express/TypeScript REST API with MongoDB (Mongoose) for authentication, student management, report management, building management, and role-based access control.

There is also a root-level `package.json` and an `iReport/` directory with a simpler Expo project stub that appears to be an earlier iteration. The main frontend code lives in `iReport/iReport/`.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (iReport/iReport/)

- **Framework**: Expo SDK 54 with Expo Router v6 (file-based routing)
- **Language**: TypeScript (with relaxed strict mode)
- **State Management**: React Context API via `@nkzw/create-context-hook` combined with `@tanstack/react-query` for async data. Multiple context providers wrap the app: AuthContext, ReportContext, StaffContext, StudentsContext, BuildingsContext, LiveReportsContext, SettingsContext.
- **Local Storage**: All data is persisted to `@react-native-async-storage/async-storage`. The frontend currently operates as a standalone app with local storage — it does NOT yet connect to the backend API. Data (users, students, reports, buildings, staff) is stored as JSON in AsyncStorage.
- **Routing Structure**: File-based routing with nested layouts:
  - `/` — Root index, redirects based on user role
  - `/login` — Authentication screen
  - `/selector` — Role-based dashboard selector
  - `/admin/` — Admin dashboard, student management, staff management, reports, map, live incidents, profile
  - `/student/` — Student report submission and viewing
  - `/teacher/` — Teacher interface
  - `/report/` — Report screens
  - `/bot` — AI chatbot (uses Groq SDK for bullying-related assistance)
  - `/settings` — App settings (dark mode, language)
  - `/hotline` — Emergency contact numbers
- **AI Integration**: Groq SDK for an in-app chatbot that helps students with bullying-related questions. Uses `EXPO_PUBLIC_GROQ_API_KEY` environment variable.
- **UI**: Custom components with React Native StyleSheet. Uses `lucide-react-native` for icons. Supports dark/light/system themes. Multi-language support (English, Filipino, Cebuano).
- **Role System**: Users have roles — admin, principal, guidance, teacher, student. Each role sees different dashboard options and has different permissions.
- **Default Admin**: A hardcoded default admin account (`admin@school.edu` / `admin123`) exists in AuthContext for initial setup.
- **Build Tool**: Uses Bun as the preferred package manager. Metro bundler with Rork SDK integration.

### Backend (iReport_Backend/)

- **Framework**: Express.js 4.x with TypeScript
- **Database**: MongoDB via Mongoose 7.x
- **Authentication**: JWT-based with bcryptjs for password hashing. Tokens include user id, email, and role.
- **Security**: 
  - Helmet for HTTP security headers
  - CORS configured (currently open with `origin: '*'`)
  - Rate limiting (100 req/15min general, 5 req/15min for auth)
  - Input validation via express-validator
- **API Routes**:
  - `POST /api/auth/register` — User registration
  - `POST /api/auth/login` — User login
  - `GET /api/auth/profile` — Get current user profile
  - `PUT /api/auth/profile` — Update profile
  - `GET/POST/PUT/DELETE /api/students` — Student CRUD
  - `GET/POST/PUT/DELETE /api/reports` — Report management
  - `GET/POST/PUT /api/reports/live/*` — Live incident reports
  - `GET/POST/PUT/DELETE /api/buildings` — Building management
- **Role-Based Access**: Middleware checks user roles for authorized endpoints (admin-only for create/update/delete operations on students, buildings)
- **Models**: User, Student, Report, LiveReport, Building — all Mongoose schemas
- **Build**: TypeScript compiled to `dist/` directory. Development uses `ts-node`.
- **Port**: Defaults to 3000 (via `BACKEND_PORT` env var)

### Key Architectural Decisions

1. **Offline-First Frontend**: The frontend stores everything in AsyncStorage rather than making API calls. This was likely chosen for rapid prototyping and demo purposes. The backend exists but isn't wired up to the frontend yet. When connecting them, the context providers would need to be updated to make HTTP requests instead of AsyncStorage reads/writes.

2. **MongoDB over SQL**: MongoDB was chosen for flexible schema design fitting the varied report types and nested data structures (buildings with rooms, reports with comments). This is appropriate for the document-oriented nature of incident reports.

3. **Context + React Query**: Using React Query with AsyncStorage as the data source provides caching, refetching, and mutation patterns even for local data, making future migration to API calls straightforward.

4. **Monorepo-ish Structure**: Frontend and backend live in the same repository but are separate Node.js projects with their own package.json files. They need to be installed and run independently.

## External Dependencies

### Backend
- **MongoDB**: Primary database. Can be local or MongoDB Atlas (cloud). Connection string via `MONGODB_URI` env var.
- **JWT**: JSON Web Tokens for auth. Secret via `JWT_SECRET` env var (required).
- **Environment Variables Required**:
  - `JWT_SECRET` (required, must be set)
  - `MONGODB_URI` (defaults to `mongodb://localhost:27017/ireport`)
  - `BACKEND_PORT` (defaults to 3000)
  - `JWT_EXPIRE` (defaults to `7d`)

### Frontend
- **Groq API**: Used for the AI chatbot feature. Requires `EXPO_PUBLIC_GROQ_API_KEY` env var.
- **Rork Platform**: The frontend was built with Rork (rork.com) and uses `@rork-ai/toolkit-sdk`. The start scripts reference Rork CLI commands.
- **Expo Services**: Standard Expo ecosystem (splash screen, image picker, haptics, location, etc.)
- **OpenAI SDK**: Listed as a dependency (likely for alternative AI integration) but Groq is the active AI provider.
- **Google Generative AI**: `@google/generative-ai` is listed as a dependency, possibly for future use.

### Running the Project
- **Backend**: `cd iReport_Backend && npm install && npm run dev` (requires MongoDB running)
- **Frontend**: `cd iReport/iReport && bun install && bun run dev` (or `npx expo start`)
- The root-level package.json is a minimal stub and not the primary entry point for either project.