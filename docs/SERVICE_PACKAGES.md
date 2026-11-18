# BNB Service Packages & Starting Prices

## Public experience

- /services#packages lets visitors compare Essential, Growth and Custom scopes across six service categories.
- Each /services/:category detail page displays packages for that service.
- An enquiry started from a package card preselects both service and package on /services?service=...&package=...#enquiry.
- The selected tier is validated on the API, saved on the MongoDB lead and included in owner/customer enquiry emails.
- Published starting prices are indicative ("Starting from ₹..."), **not final quotations, invoices, checkout totals, or payment requests**.
- No fixed prices are published by default. They must be set and published by the administrator.

## Pricing management

1. Open https://boardnbyte.vercel.app/admin/leads and log in with an existing BNB admin account.
2. Select "Manage pricing" (or scroll to "Packages & starting prices").
3. Choose the service category, then enter a starting price in INR for either editable tier.
4. Keep "Publish this starting price" unchecked to save a draft visible to admins only.
5. When approved for public display, enable Publish and save. The public catalogue fetches pricing from the database, not a hardcoded amount.
6. Uncheck Publish and save to hide an existing price. Custom packages are permanently quotation-only.
7. Refresh the public packages section to verify that only approved prices show.

Price values are validated as whole rupees between 1,000 and 50,000,000. Service and package tier identifiers are validated on the server; the client cannot send a monetary price for its own enquiry.

## API

- GET /api/packages — public catalogue with only published prices.
- GET /api/packages/admin — current package catalogue and draft/published states, protected by admin JWT.
- PATCH /api/packages/:serviceId/:tierId — admin JWT required; accepts exact JSON shape with startingPriceINR (integer) and published (boolean).
- POST /api/leads — optionally includes packageTierId (starter, growth or custom) with validated serviceId. Existing enquiries without packageTierId remain compatible.

No additional deployment secrets or dependencies required. The existing MongoDB Atlas connection is used.

## Not yet implemented

- Formal quotation generation and acceptance.
- Client approval, invoicing, payment collection or milestone billing.
- Admin-edited package feature lists (descriptive scopes currently live in versioned source code).
- Tax/GST calculations, contractual terms, content licensing and refund policies.

Before billing any real client, agree on scope, costs, timelines, change requests, source ownership and milestone terms in writing.
