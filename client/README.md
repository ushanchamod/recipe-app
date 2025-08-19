## Recipe App — Client (React + Vite)

React frontend built with Vite and Tailwind CSS. Integrates with the server API for authentication, recipe browsing, and favorites.

### Tech
- React 19, Vite 7, Tailwind CSS, TanStack Query, React Router, React Hook Form, Zod, Zustand

### Prerequisites
- Node.js 18+
- Running API server (see `../server`)

### Environment variables
Create `client/.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

### Install
```bash
cd client
npm install
```

### Scripts
- `npm run dev` — start Vite dev server (default `http://localhost:5173`)
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build locally

### Run (development)
```bash
cd client
npm run dev
```
Open the URL printed by Vite (typically `http://localhost:5173`).

### API client
Requests are made via `src/hooks/useAxios.tsx`:
- Uses `baseURL` from `VITE_API_URL`
- Sends `withCredentials: true` (cookie‑based auth)

### App structure (high‑level)
```
client/
  src/
    pages/           # Home, Login, Register, FavoritePage
    components/      # RecipeCard, RecipePopup, Sidebar, Search, TopBar
    hooks/           # useAxios, useSearchDebounce
    stores/          # useAuthStore, usePopup
    advancedRoutes/  # ProtectedRoute, GuestRoute
    layouts/         # RootLayout
    Routers.tsx      # Route definitions
    main.tsx         # App bootstrap
```

### Common issues
- 401/403 from API → ensure the server is running, you are logged in, and `VITE_API_URL` matches server base URL; server `CORS_ORIGIN` must match `http://localhost:5173` in development.

---
Author: Ushan


