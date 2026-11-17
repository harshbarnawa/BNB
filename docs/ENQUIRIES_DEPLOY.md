# BNB Enquiries API — Deployment

## Purpose

The standalone backend entrypoint \`backend/leadsServer.js\` exposes only:

- \`GET /health\` — 200 when MongoDB is connected, 503 otherwise.
- \`POST /api/leads\` — public service enquiry submission with validation and consent.
- \`POST /api/auth/login\` — existing BNB email/password login (rate limited).
- \`GET /api/leads\` — admin-only paginated lead list.
- \`PATCH /api/leads/:id\` — admin-only status and notes updates.

This deployment intentionally does **not** expose the existing store, checkout, product, payment or registration routes. Those routes require separate security review and integration tests before any public production deployment.

## Deploy to Render

A root-level \`render.yaml\` Blueprint is provided. In Render, connect the \`harshbarnawa/BNB\` repository on the \`main\` branch and create a Blueprint with this file.

It provisions a **Free** web service for integration testing only. Render warns against Free instances for production: they spin down when idle and can take time to restart. Upgrade to a suitable production service before relying on customer enquiries.

During Blueprint setup, Render asks for \`MONGO_URI\`. Paste the MongoDB Atlas connection string **only in Render's environment variable form**, never in GitHub or chat. Render generates the JWT signing secret. Use the intended existing Atlas database, and verify its Atlas network access settings permit your Render service to connect.

The configured allowed frontend origin is \`https://boardnbyte.vercel.app\`. If you add a custom domain, change \`FRONTEND_ORIGIN\` in the Render service (comma-separated exact origins are supported) and redeploy.

Test \`https://YOUR-RENDER-HOST/health\`. It should return HTTP 200 with \`{"status":"ok"}\` when the service is healthy and connected to Atlas.

## Connect Vercel frontend

In Vercel's BNB project, set \`REACT_APP_API_BASE_URL\` to the deployed HTTPS backend origin with no trailing slash, then redeploy the **frontend**. Example format: \`https://your-service.onrender.com\`.

This is a public API origin, not a secret. **Do not** put \`MONGO_URI\`, \`JWT_SECRET\` or credentials in any \`REACT_APP_*\` variable or frontend file.

Then verify \`/services#enquiry\` and \`/admin/leads\`. An existing MongoDB user must already have \`role: "admin"\`; this feature does not provision public admin registration or create a default password.

## Tests and operations

The GitHub Actions workflow runs \`npm ci && npm run build\` in the frontend and \`npm ci && npm test\` in the backend on pushes to main/development. Backend tests cover validation, routing, unauthorized access and CORS without needing a real database.

Before using the enquiry form with real customers, additionally validate:
1. Successful connection to your Atlas database, correct indexes and no credentials in logs.
2. A test submission returns 201 and stores a single lead. Invalid consent or too-short requirements return 400.
3. Unauthenticated lead listing returns 401 and non-admin listing returns 403.
4. An authenticated admin can view a lead, change status and notes, and persist them across refreshes.
5. Proper monitoring, retention/deletion procedures, privacy policy and abuse protection.

Current limiter is in-memory and resets with process restarts, and a Free service can sleep. A stronger shared rate limiter, spam challenge, and production-grade hosting are recommended before launch.

Email alerts are optional and not configured by default. Free Render services restrict common SMTP ports; if notifications are required, prefer a vetted transactional email provider with HTTPS API.

Never share private environment variables in the chat or commit \`.env\` files.
