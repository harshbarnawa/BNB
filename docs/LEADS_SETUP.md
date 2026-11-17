# BNB Service Enquiries — Setup & Validation

## What is implemented

- Public service enquiry form at /services#enquiry, with service preselection from category pages.
- POST /api/leads creates a MongoDB lead after server-side validation and consent.
- Optional notification email when EMAIL_USER, EMAIL_PASS and LEAD_NOTIFICATION_EMAIL are set.
- GET /api/leads and PATCH /api/leads/:id require an authenticated admin account.
- Admin lead dashboard at /admin/leads with login, pagination, status filter, notes and status updates.
- Honeypot and basic per-process rate limiting (5 submissions per 30 minutes per seen IP).

## Configuration

Backend env variables (never commit real .env files):

- MONGO_URI — MongoDB Atlas connection URI.
- JWT_SECRET — strong existing secret used for admin login.
- PORT — optional, defaults to 5000.
- EMAIL_USER, EMAIL_PASS — optional existing Gmail SMTP credentials.
- LEAD_NOTIFICATION_EMAIL — optional destination for new lead alerts.

Frontend build-time env:

- REACT_APP_API_BASE_URL — deployed backend HTTPS origin (no trailing slash).
- For local development on localhost, the frontend defaults to http://localhost:5000 when this variable is absent.

Vercel project has frontend as its root directory. Set REACT_APP_API_BASE_URL on that Vercel project and redeploy after the backend is deployed. Backend is a separate Express app: publishing the React frontend alone does not deploy Express or MongoDB, and public submissions remain disabled without the configured backend URL. Do not use a localhost URL on the production frontend.

## Run locally

In backend:
- npm ci
- Set MONGO_URI and JWT_SECRET privately
- npm start

In frontend:
- npm ci
- npm start

Then visit http://localhost:3000/services#enquiry and http://localhost:3000/admin/leads.

No payment keys are needed for the enquiry feature itself, but the current backend imports payment modules. Do not enable live payments or use production secrets for test runs.

## Admin account

The existing /api/auth/login endpoint supplies admin JWTs. Only accounts with role "admin" in MongoDB can view or update enquiries. There is no public admin registration endpoint in this feature. Assign admin permissions only to trusted users through your existing secure operational process; never add a default admin password to the repository.

## Manual verification checklist

1. Confirm both frontend and backend are reachable over HTTPS.
2. Submit a valid enquiry with consent and at least 20 characters in requirements; expect HTTP 201 and a reference ID.
3. Confirm exactly one record appears in MongoDB.
4. Submit invalid input without consent; expect HTTP 400 and no record.
5. Send repeated requests and confirm HTTP 429 from the in-process limiter.
6. Confirm an unauthenticated GET /api/leads returns HTTP 401.
7. Confirm a non-admin user receives HTTP 403.
8. Sign in as admin, filter leads, change status and save notes, then refresh to confirm persistence.
9. Check that notification email is optional and its failures do not falsely reject saved leads.
10. Verify mobile layout, copy brief fallback, and error handling when the backend is offline.

## Important limits before public launch

- In-process rate limiting is not shared between server instances or restarts. Add a shared Redis/edge rate limiter and CAPTCHA/Turnstile if spam grows or traffic warrants it.
- Restrict production CORS origins, add monitoring, retention/deletion policy, privacy notice and data-access controls before accepting real customer information at scale.
- Do not claim the backend is deployed or the MongoDB submission flow works until an authenticated end-to-end test has passed.
- The existing production main branch contains other legacy commerce code and has not had a full integration/security audit. The middleware casing repair fixes imports, but this does not certify those features production-ready.
