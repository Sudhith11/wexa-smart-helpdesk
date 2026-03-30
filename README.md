# WEXA Smart Helpdesk

WEXA Smart Helpdesk is a full-stack support platform for WEXA with role-based access, AI-assisted ticket triage, knowledge base management, and an audit trail for every automated step.

## What The Project Includes

- React + Vite frontend with a WEXA-branded dashboard
- Node.js + Express backend with JWT authentication
- MongoDB persistence through Mongoose
- Automatic bootstrap of demo users, starter KB articles, and assistant settings
- AI-style triage workflow that:
  - classifies a ticket
  - searches the knowledge base
  - drafts a reply
  - either auto-resolves or sends the ticket to human review
- Admin settings for auto-close behavior and confidence threshold
- Backend tests with Jest and Supertest
- Frontend lint/build verification with Vite + ESLint

## Roles And Demo Accounts

The backend bootstraps these accounts automatically when the database is empty:

- User: `user@helpdesk.com` / `user123`
- Agent: `agent@helpdesk.com` / `agent123`
- Admin: `admin@helpdesk.com` / `admin123`

## Tech Stack

### Frontend

- React 18
- Vite 7
- React Router
- Zustand
- Tailwind CSS 4
- Axios
- Lucide React

### Backend

- Node.js
- Express 5
- Mongoose
- JWT auth
- bcryptjs
- Jest
- Supertest

### Database

- MongoDB Atlas for persistent data
- In-memory MongoDB fallback for local/offline development

## Project Structure

```text
wexa-smart-helpdesk/
|-- backend/
|   |-- scripts/
|   |-- src/
|   |   |-- bootstrap/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   `-- services/
|   |-- tests/
|   `-- server.js
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- lib/
|   |   |-- pages/
|   |   `-- store/
|   `-- vite.config.js
`-- docker-compose.yml
```

## Features

### Authentication

- Login and registration
- JWT-based protected routes
- Role-aware UI for user, agent, and admin

### Tickets

- Create support tickets
- View ticket list and ticket detail page
- See classification, suggestion, and current status
- Inspect audit logs for all assistant actions

### Knowledge Base

- Search KB articles as an authenticated user
- Create, edit, and delete KB articles as admin
- Publish or save drafts

### Assistant Workflow

When a user creates a ticket, the backend:

1. classifies the issue into `billing`, `tech`, `shipping`, or `other`
2. finds matching KB articles
3. drafts a suggested reply
4. resolves the ticket automatically if confidence is high enough
5. records each step in the audit log

### Admin Controls

- Toggle ticket auto-close
- Change the confidence threshold

## Environment Variables

Do not commit real `.env` files. Use the example files below.

### Backend

Create [backend/.env](C:\Users\SUDHITH\wexa-smart-helpdesk\backend\.env) from [backend/.env.example](C:\Users\SUDHITH\wexa-smart-helpdesk\backend\.env.example).

Required values:

```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/wexahelpdesk
JWT_SECRET=replace-with-a-strong-secret
STUB_MODE=true
ALLOW_DB_FALLBACK=true
```

Optional values:

```env
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
USE_IN_MEMORY_DB=false
OPENAI_API_KEY=
```

### Frontend

Create [frontend/.env](C:\Users\SUDHITH\wexa-smart-helpdesk\frontend\.env) from [frontend/.env.example](C:\Users\SUDHITH\wexa-smart-helpdesk\frontend\.env.example).

```env
VITE_API_URL=http://localhost:8080/api
```

## Local Setup

### Software To Install

- Node.js 20+ or newer
- npm
- Git
- MongoDB Atlas account if you want persistent cloud data

### 1. Clone The Repository

```bash
git clone https://github.com/Sudhith11/wexa-smart-helpdesk.git
cd wexa-smart-helpdesk
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Start The Backend

From [backend](C:\Users\SUDHITH\wexa-smart-helpdesk\backend):

```bash
npm start
```

Expected output:

```text
Mongo connected
API on 8080
```

If Atlas is not reachable, the backend falls back to an in-memory database and still starts locally.

### 5. Start The Frontend

From [frontend](C:\Users\SUDHITH\wexa-smart-helpdesk\frontend):

```bash
npm run dev
```

Open:

- `http://localhost:5173`

## Verification Commands

### Frontend

From [frontend](C:\Users\SUDHITH\wexa-smart-helpdesk\frontend):

```bash
npm run lint
npm run build
```

### Backend

From [backend](C:\Users\SUDHITH\wexa-smart-helpdesk\backend):

```bash
npm test
```

## Docker

You can also run the stack with Docker Compose:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- MongoDB: `mongodb://localhost:27017`

## API Summary

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Tickets

- `GET /api/tickets`
- `POST /api/tickets`
- `GET /api/tickets/:id`
- `GET /api/tickets/:id/audit`
- `POST /api/tickets/:id/reply`
- `POST /api/tickets/:id/assign`

### Knowledge Base

- `GET /api/kb`
- `POST /api/kb`
- `PUT /api/kb/:id`
- `DELETE /api/kb/:id`

### Assistant

- `GET /api/agent/suggestion/:ticketId`
- `GET /api/agent/config`
- `PUT /api/agent/config`

## Current Behavior Notes

- If MongoDB Atlas is unavailable, the backend can use an in-memory fallback database
- Default users and KB content are created automatically on an empty database
- Frontend routing is protected by JWT auth
- Admin settings are stored in the database, not hardcoded in the frontend

## Deployment Notes

### Frontend

- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_URL` to your deployed backend URL

### Backend

- Start command: `npm start`
- Set a real `MONGO_URI`
- Set a strong `JWT_SECRET`
- Set `CORS_ORIGIN` to your frontend domain

## GitHub Hygiene

This repo now ignores:

- `node_modules`
- `dist`
- `.env`
- local log files

Real secrets should stay only in local `.env` files or your hosting platform environment settings.
