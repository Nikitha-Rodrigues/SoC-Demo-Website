# DBMSWebsite - SOC Dashboard

This is a Next.js (App Router) + TypeScript + Tailwind CSS demo SOC Dashboard that connects to MySQL and MongoDB.

Quick start

1. Install dependencies

```bash
cd DBMSWebsite
npm install
```

2. Create a `.env` file based on `.env.example` and fill in values for MySQL and MongoDB.

3. Run dev server

```bash
npm run dev
```

Login

- Visit `http://localhost:3000/login` and sign in. On success you'll be redirected to `/dashboard/attack`.

Debugging login issues

If login fails, first verify your credentials are correct:

```bash
node scripts/testLogin.js admin mypassword123
```

This will:
1. Connect to your MySQL database
2. Look up the user
3. Test the bcrypt password comparison
4. Tell you if credentials are valid

If the script says the password doesn't match, create a fresh user:

```bash
node scripts/addUser.js admin newpassword123
```

Then try logging in with the new password.

Database notes

- MySQL should have tables: `users(username VARCHAR, password VARCHAR)`, `attack`, `flow`, `packet`.
- To add a user, run the helper script:

```bash
node scripts/addUser.js admin mypassword123
```

This hashes the password with bcrypt and inserts it into your users table. You'll need `.env` configured first.

API routes

- `POST /api/login` - login (sets HTTP-only cookie)
- `DELETE /api/login` - logout
- `POST /api/attack` - actions for attacks
- `POST /api/flow` - actions for flows
- `POST /api/packet` - actions for packets
- `POST /api/vulnerability` - queries MongoDB vulnerabilities

Security

- All SQL uses parameterized queries via `mysql2` to avoid SQL injection.
- DB credentials are read from environment variables only.
- Authentication uses localStorage to store a simple auth flag after successful login.
- Dashboard routes are protected with a client-side ProtectedRoute component.
