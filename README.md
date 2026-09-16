# AuthMod

<p align="left">
   <img src="https://skillicons.dev/icons?i=ts,nodejs,express,mysql" height="26"/>

  <img src="https://go-skill-icons.vercel.app/api/icons?i=drizzle" height="26"/>
    &nbsp;
</p>

<p align="left">
  <strong>A simple Role-Based Access Control (RBAC) authentication service</strong><br/>
  Built with TypeScript, Express, Drizzle ORM and MySQL.
</p>

---

## Features

- **RBAC (Role-Based Access Control)**
  - **ADMIN** – Full system access
  - **MODERATOR** – Can manage regular users
  - **USER** – Can manage only their own account
- JWT authentication using **HttpOnly Cookies**
- Password hashing with **bcrypt**
- Complete User CRUD
- Drizzle ORM migrations
- Type-safe DTOs and models

## Tech Stack

- TypeScript
- Node.js + Express
- Drizzle ORM
- MySQL (`mysql2`)
- JSON Web Token
- bcrypt

## Project Structure

```text
src/
├── models/          # Drizzle schemas
├── controller/      # Controllers
├── router/          # Router
├── service/         # Services & middleware
├── types/           # DTOs and shared types
├── util/            # DB, env loader, logger
└── index.ts
```

## Environment Configuration

All environment variables are loaded and validated through:

```text
src/util/envLoader.ts
```

Create a `.env` file in the project root and define the required variables there. Refer to `envLoader.ts` for the complete list of required variables and validation.

## Database

Generate migrations:

```bash
npm run db:generate
```

Apply migrations:

```bash
npm run db:migrate
```

Push schema during development:

```bash
npm run db:push
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/user/new` | Register a new user |
| POST | `/auth/user/login` | Login & set HttpOnly JWT cookie |
| POST | `/auth/user/logout` | Logout & clear cookie |
| GET | `/auth/user/me` | Fetch authenticated user |
| GET | `/auth/user` | Search users |
| GET | `/auth/user/all` | Fetch all users |
| PATCH | `/auth/user/:uid` | Update user |
| DELETE | `/auth/user/:uid` | Delete user |

## RBAC Permissions

| Action | USER | MODERATOR | ADMIN |
|---|:---:|:---:|:---:|
| Read users | ✓ | ✓ | ✓ |
| Update own account | ✓ | ✓ | ✓ |
| Update regular users | ✗ | ✓ | ✓ |
| Update moderators | ✗ | Self | ✓ |
| Update admins | ✗ | ✗ | ✓ |
| Delete own account | ✓ | ✓ | ✓ |
| Delete regular users | ✗ | ✓ | ✓ |
| Delete moderators | ✗ | ✗ | ✓ |
| Delete admins | ✗ | ✗ | ✓ |

## Admin Account Creation

> **Admin accounts cannot be created through the application.**

The registration endpoint always creates a **USER**. Administrator accounts must be created or promoted directly in the database by modifying the `role` column. This prevents privilege escalation through the public API.

## Running

```bash
npm install
npm run dev
```

## Database Portability

Although MySQL is the default implementation, AuthMod uses **Drizzle ORM**, allowing the SQL backend to be switched to PostgreSQL, SQLite, or managed cloud SQL providers with minimal changes to the application logic.

## License

MIT