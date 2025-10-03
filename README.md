# Klontong (Frontend)

## Setup

Prereqs: Node 18+, pnpm 8+

1. Install

```bash
pnpm install
```

2. Env

```env
VITE_API_BASE_URL=https://crudcrud.com/api/<your-key>
VITE_ADMIN_EMAIL=admin@mail.com
VITE_ADMIN_PASSWORD=password
```

3. Run

```bash
pnpm dev
```

4. (Optional) Seed ~100 products

```bash
pnpm seed:products --count=100
```

Login for demo

- Email: admin@mail.com
- Password: password

## API setup options

You can run the API locally with json-server or use CrudCrud hosted API. Pick one and set `VITE_API_BASE_URL` accordingly.

### Option A — Local json-server

1. Install (already added as a dev dependency)

```bash
pnpm install
```

2. Start API on http://localhost:5179

```bash
pnpm api:json
```

3. Configure the frontend to point to the local API

```env
VITE_API_BASE_URL=http://localhost:5179
```

4. Seed data via the API (optional)

```bash
# either set .env to localhost first or override inline
VITE_API_BASE_URL=http://localhost:5179 pnpm seed:products --count=100
```

Notes

- json-server writes into `scripts/db.json` (pre-created with `{ "products": [] }`).
- Supports GET/POST/PUT/DELETE at `/products`.

### Option B — CrudCrud.com

1. Get your API key from https://crudcrud.com/

2. Configure the frontend

```env
VITE_API_BASE_URL=https://crudcrud.com/api/<your-key>
```

3. Seed data (optional, mind free limits)

```bash
pnpm seed:products --count=50
```

Notes

- CrudCrud resources use `_id` fields; the app handles this automatically.
- When updating on CrudCrud, the request body must not include `_id` (already handled by the app).

## Pages

- /login, /register
- /products (list with search + pagination, 10/page)
- /products/:id (detail, admin can edit/delete)
- /products/create
- /products/:id/edit (forms with validation)

## Data/persistence

- API: Axios to `${VITE_API_BASE_URL}` (CrudCrud friendly)
- Client cache: TanStack Query persisted to IndexedDB (localforage)
- Auth session: localStorage (Pinia store)

## Test flow (mermaid)

```mermaid
flowchart TD
   A[Open /login] -->|Login as admin@mail.com| B[/products]
   A -->|Register new user| B
   B --> C{Search/Paginate}
   C -->|Click Item| D[/products/:id]
   D -->|Edit| E[/products/:id/edit]
   D -->|Delete| B
   B -->|Add Product| F[/products/create]
   F --> B
   E --> D
```

### Flow explanation

- Start at `/login`. Log in as admin (env credentials) or go to `/register` to create a user.
- After auth, you land on `/products`. Search and paginate to find an item.
- Click a product to view `/products/:id`.
  - Choose Edit to go to `/products/:id/edit`, save to return to detail.
  - Choose Delete to remove the product and return to the list.
- From the list, use “Add Product” to open `/products/create`, save to return to the list.
- Route guard: unauthenticated users are redirected to `/login`; authenticated users visiting `/login` or `/register` are redirected to `/products`.
- Persistence: session is kept in localStorage; server state is cached with TanStack Query and rehydrates on refresh.

## Notes

- JSON payloads; schema validated with zod.
- Responsive/mobile-first. No IE support.
- Seeder posts to `/products` and includes categoryName.
