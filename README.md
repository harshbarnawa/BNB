# BNB — Board N Byte

BNB is a founder-led digital studio and tech store, bringing digital services and useful technology together under one brand.

## Two ways to build

### Digital Services
- Business and portfolio websites
- E-commerce development
- Custom web applications and dashboards
- Frontend and UI engineering
- Interactive design concepts and custom project enquiries

BNB offers both defined service packages and custom projects. Custom work follows a written scope, advance payment and agreed milestones. Completed commissioned deliverables are handed over to the client after final payment, with ownership terms documented in the agreement. Limited bug-fix support and optional paid maintenance are offered after delivery.

### Tech Store
The store focuses on PC and tech accessories, including keyboards, mice, audio gear, desk accessories, gaming accessories and tech essentials.

The store will launch in phases. Sample catalogue data is for development and demonstration only; real selling begins after supplier, inventory, pricing, shipping and returns are verified. The intended sourcing and fulfilment model is hybrid. Indian checkout is planned to support eligible Cash on Delivery alongside online payment; international orders require supported online prepayment.

## Website direction

- Shared BNB identity across Services and Store
- Premium black/white foundation with mint accent `#16B98A`
- English default with Hindi language option planned
- Homepage gives equal prominence to Digital Services and Tech Store
- Services includes a real-project portfolio and a separate interactive Theme Gallery
- Theme Gallery categories: Business, E-commerce, Portfolio, SaaS & Dashboards, Landing Pages, Custom Web Applications
- Demo environments use mock data and must be clearly labelled as demos

## Repository structure

- `backend/`: Express, MongoDB/Mongoose, authentication, product/order APIs, Razorpay integration, Cloudinary and email
- `frontend/`: React application
- `docs/IMPLEMENTATION_AUDIT.md`: current source audit, confirmed issues and implementation sequence

## Local development

Backend:
1. `cd backend`
2. Install dependencies with `npm install`
3. Configure environment variables in `.env` (see the existing backend configuration)
4. Run `npm run dev`

Frontend:
1. `cd frontend`
2. Install dependencies with `npm install`
3. Run `npm start`

The frontend is under active development. Do not treat the preview catalogue as live inventory or the contact section as a connected enquiry service until the corresponding integrations are implemented.

## Branch policy

- `main` is kept untouched as the baseline.
- Active implementation takes place on `development`.
- Merge to `main` only after review and testing.
