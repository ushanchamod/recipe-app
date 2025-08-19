## Recipe App — Server (Express + TypeScript)

REST API built with Express, TypeScript, and MongoDB. Provides authentication, recipe search via TheMealDB, and favorite recipe management.

### Tech
- Node.js, Express 5, TypeScript, Mongoose, Zod, JWT (cookie‑based auth)

### Prerequisites
- Node.js 18+
- MongoDB connection string (local or Atlas)

### Environment variables
Create `server/.env`:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=replace-with-long-random-string
CORS_ORIGIN=http://localhost:5173
```

### Install
```bash
cd server
npm install
```

### Scripts
- `npm run dev` — start with ts-node + nodemon
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run compiled server
- `npm run lint` — lint `src/**/*.ts`

### Run (development)
```bash
cd server
npm run dev
```

### Run (production)
```bash
cd server
npm run build
npm start
```

### Base URL
```
http://localhost:3000/api
```

### Endpoints
Auth & User (`/user`):
- `POST /user/register` — body: `{ username, email, firstName, lastName, password }`
- `POST /user/login` — body: `{ username, password }` → sets `token` http‑only cookie
- `POST /user/logout` — clears auth cookie
- `GET /user/me` — current user (requires auth)
- `GET /user/favorite-recipes` — list favorites (requires auth)
- `PATCH /user/favorite-recipes` — body: `{ recipeId: string, isFavorite: boolean }` (requires auth)

Recipes (`/recipes`):
- `GET /recipes` — query: `name?: string`, `category?: string`
- `GET /recipes/category` — list recipe categories

External data source: TheMealDB (`https://www.themealdb.com`).

### Auth & CORS
- Auth token is stored in an http‑only cookie; client must send credentials.
- CORS allows credentials from `CORS_ORIGIN` only; keep this in sync with the client origin.

### Project structure
```
server/
  src/
    app.ts           # Express app wiring (CORS, routers, error handler)
    server.ts        # Entry; DB connect + listen
    routes/          # `/api/user`, `/api/recipes`
    controllers/     # handlers for users/recipes
    middlewares/     # auth guard, validation, errors
    models/          # Mongoose models
    validators/      # Zod DTOs
    utils/           # response helpers
    service/db.ts    # Mongo connection
    config/config.ts # env config
```

### Troubleshooting
- Mongo connection errors → check `DATABASE_URL` and Atlas network access.
- 401/403 on protected routes → ensure login succeeded and client uses `withCredentials` with origin matching `CORS_ORIGIN`.

---
Author: Ushan


