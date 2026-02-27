# Nexus Blog Frontend (React)

This is the React frontend for the Nexus full-stack blog app.

## Quick Start

1) Install dependencies

```bash
npm install
```

2) (Optional) Set API base URL

Create a `.env` file in this folder:

```env
REACT_APP_API_URL=http://localhost:4000
```

3) Run the app

```bash
npm start
```

Open `http://localhost:3000`.

## Demo Login (for testers / HR)

- Email: `demo@test.com`
- Password: `demo@123`

If the demo user doesn't exist yet, run this from the backend:

```bash
cd ../backend
npm run seed:demo
```

## Notes

- Auth uses JWT stored in **HttpOnly cookies**. The frontend always sends requests with `credentials: 'include'`.
- For full backend setup and environment variables, see the root project README.

## Scripts

- `npm start` – start dev server
- `npm run build` – production build
- `npm test` – tests (if present)
