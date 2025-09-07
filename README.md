# E‑Commerce (React + Vite + Tailwind | Node.js + Express + MongoDB)

Modern full‑stack e‑commerce app. Frontend provides authentication, product listing with filters, cart with persistence, INR pricing, dark/light theme. Backend exposes secure REST APIs with JWT auth and MongoDB.

## Monorepo Layout

```
2/
├─ backend/
│  ├─ package.json
│  ├─ seed.js
│  └─ src/
│     ├─ app.js                 # Express app, middleware, CORS
│     ├─ index.js               # Boot + DB connect
│     ├─ controllers/
│     │  ├─ cart.controller.js  # get/add/remove cart
│     │  ├─ item.controller.js  # CRUD, filters
│     │  └─ user.controller.js  # auth, tokens, cookies
│     ├─ middleware/
│     │  └─ auth.middleware.js  # verifyJWT
│     ├─ models/
│     │  ├─ item.models.js      # Item(name, price, category)
│     │  └─ user.models.js      # User + cart schema
│     ├─ routes/
│     │  ├─ cart.routes.js
│     │  ├─ item.routes.js
│     │  └─ user.routes.js
│     └─ utils/                 # apiError, apiResponse, asyncHandler
└─ frontend/
   ├─ package.json
   ├─ vite.config.js
   └─ src/
      ├─ App.jsx                # Router + providers
      ├─ main.jsx               # Mount
      ├─ index.css              # Tailwind + base styles (light/dark)
      ├─ components/
      │  └─ Navbar.jsx          # Nav + cart count + theme toggle
      ├─ contexts/
      │  ├─ AuthContext.jsx     # login/signup/logout, token storage
      │  ├─ CartContext.jsx     # cart (local + server sync)
      │  └─ ThemeContext.jsx    # light/dark persisted
      ├─ pages/
      │  ├─ Home.jsx            # listing + filters + add to cart
      │  ├─ Cart.jsx            # quantities, remove, totals
      │  ├─ Login.jsx
      │  └─ Signup.jsx
      └─ utils/
         ├─ currency.js         # formatINR
         └─ images.js           # Pexels mapping (curated/keyword)
```

## Key Features

- Auth (signup/login/logout) with JWT (header) and secure server endpoints
- Product listing with category + min/max price filters
- Cart
  - Logged out: localStorage
  - Logged in: server cart; merges local → server on login
- INR currency formatting
- Responsive Tailwind UI with modern hover/active states
- Light/Dark theme toggle (persisted)
- Product images via curated Pexels links per item/category (no API key needed). Optional live Pexels API supported.


## License

MIT
