# 📰 PrismaPress — Backend Server

A modern, type-safe backend server for a full-stack blogging platform built with **Express.js v5**, **TypeScript**, **Prisma ORM v7**, and **PostgreSQL**.

---

## 🚀 Tech Stack

| Technology             | Purpose                          |
| ---------------------- | -------------------------------- |
| **Express.js v5**      | HTTP server & routing            |
| **TypeScript**         | Type-safe development            |
| **Prisma ORM v7**      | Database ORM & schema management |
| **@prisma/adapter-pg** | PostgreSQL driver adapter        |
| **PostgreSQL**         | Relational database              |
| **bcrypt**             | Password hashing                 |
| **JWT**                | Authentication tokens            |
| **cookie-parser**      | Cookie handling                  |
| **CORS**               | Cross-origin resource sharing    |
| **dotenv**             | Environment variable management  |

---

## 📁 Project Structure

```
prisma-press-server/
├── prisma/
│   ├── schema/
│   │   ├── schema.prisma      # Datasource & generator config
│   │   ├── user.prisma         # User model
│   │   ├── profile.prisma      # Profile model
│   │   └── enum.prisma         # Enums (Role, ActiveStatus)
│   └── migrations/
│       └── 20260811172120_init/ # Initial migration
├── src/
│   ├── app.ts                  # Express app setup & middleware
│   ├── server.ts               # Server entry point & DB connection
│   ├── config/
│   │   └── index.ts            # Environment config
│   ├── lib/
│   │   └── prisma.ts           # Prisma client singleton
│   └── modules/
│       └── users/
│           ├── user.interface.ts   # TypeScript interfaces
│           ├── user.route.ts       # Route definitions
│           ├── user.controller.ts  # Request handlers
│           └── user.service.ts     # Business logic & DB queries
├── generated/                  # Prisma generated client
├── prisma.config.ts            # Prisma configuration
├── tsconfig.json               # TypeScript configuration
├── package.json
├── .env.example
└── .gitignore
```

---

## 🗄️ Database Schema

### User Model

| Field          | Type           | Details                    |
| -------------- | -------------- | -------------------------- |
| `id`           | `String`       | UUID, Primary Key          |
| `name`         | `String`       | VarChar(225)               |
| `email`        | `String`       | Unique                     |
| `password`     | `String`       | Hashed with bcrypt         |
| `activeStatus` | `ActiveStatus` | Default: `ACTIVE`          |
| `role`         | `Role`         | Default: `USER`            |
| `createdAt`    | `DateTime`     | Auto-generated             |
| `updatedAt`    | `DateTime`     | Auto-updated               |
| `profile`      | `Profile?`     | One-to-one relation        |

### Profile Model

| Field          | Type       | Details                         |
| -------------- | ---------- | ------------------------------- |
| `id`           | `String`   | UUID, Primary Key               |
| `profilePhoto` | `String?`  | Optional                        |
| `bio`          | `String?`  | Optional                        |
| `userId`       | `String`   | Unique, Foreign Key → User      |
| `createdAt`    | `DateTime` | Auto-generated                  |
| `updatedAt`    | `DateTime` | Auto-updated                    |

### Enums

```prisma
enum ActiveStatus {
    ACTIVE
    BLOCKED
}

enum Role {
    USER
    AUTHOR
    ADMIN
}
```

---

## 🔗 API Endpoints

### Users

| Method | Endpoint              | Description       |
| ------ | --------------------- | ----------------- |
| `POST` | `/api/users/register` | Register new user |

#### Register User

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "your_password",
  "profilePhoto": "https://example.com/photo.jpg" // optional
}
```

**Success Response:** `201 Created`

```json
{
  "success": true,
  "status": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "activeStatus": "ACTIVE",
      "role": "USER",
      "createdAt": "2026-08-12T...",
      "updatedAt": "2026-08-12T...",
      "profile": {
        "id": "uuid",
        "profilePhoto": "https://example.com/photo.jpg",
        "bio": null,
        "userId": "uuid",
        "createdAt": "2026-08-12T...",
        "updatedAt": "2026-08-12T..."
      }
    }
  }
}
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** (v18+)
- **PostgreSQL** database
- **npm** or **yarn**

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/prisma-press-server.git
   cd prisma-press-server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your configuration:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/prisma_press"
   PORT=5000
   APP_URL="http://localhost:3000"
   BCRYPT_SALT_ROUNDS=12
   JWT_ACCESS_SECRET="your_access_secret"
   JWT_REFRESH_SECRET="your_refresh_secret"
   JWT_ACCESS_EXPIRES_IN="15m"
   JWT_REFRESH_EXPIRES_IN="7d"
   ```

4. **Generate Prisma Client:**

   ```bash
   npx prisma generate
   ```

5. **Run database migrations:**

   ```bash
   npx prisma migrate dev
   ```

6. **Start the development server:**

   ```bash
   npm run dev
   ```

   Server will be running at `http://localhost:5000`

---

## 📜 Available Scripts

| Script          | Command                  | Description                   |
| --------------- | ------------------------ | ----------------------------- |
| `npm run dev`   | `tsx watch src/server.ts`| Start dev server with hot reload |
| `npm run build` | `tsc`                    | Build TypeScript to JavaScript |
| `npm start`     | `node dist/server.js`    | Start production server       |

---

## 🛠️ Key Features

- **Prisma ORM v7** with multi-file schema architecture and `@prisma/adapter-pg` driver adapter
- **Modular architecture** — Route → Controller → Service pattern
- **Type-safe** — End-to-end TypeScript with Prisma generated types
- **Secure passwords** — bcrypt hashing with configurable salt rounds
- **Role-based access** — USER, AUTHOR, ADMIN roles built into the schema
- **Account management** — ACTIVE / BLOCKED status tracking
- **Auto profile creation** — Profile is automatically created on user registration
- **Password omission** — Passwords are never returned in API responses using Prisma's `omit`

---

## 📄 License

ISC
