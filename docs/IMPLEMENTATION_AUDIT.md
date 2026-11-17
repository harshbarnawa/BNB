# BNB implementation audit

Audit date: 2026-11-17
Repository: harshbarnawa/BNB
Working branch: development

## Branch safety

- `development` was created from the existing `main` branch.
- `main` remains at baseline commit `91f84f9d322a338d24bdac2f0891ceb3018c51c3`; all implementation commits are isolated on `development`.
- Do not merge or deploy until local build, API tests, and payment sandbox tests pass.

## Implemented in this work session

### Frontend foundation
- Replaced the placeholder React homepage with the BNB studio + tech store landing-page foundation.
- Added the shared black/white/mint identity, two primary paths, services overview, six Theme Gallery categories, illustrative product previews, about and contact sections.
- Added responsive styles, metadata, and global CSS.
- This is a homepage foundation, not the complete Services/Store experience. Contact and WhatsApp integrations are not connected yet.

### Backend reliability and commerce
- Corrected middleware filename casing for Linux deployments.
- Authentication middleware now rejects missing, invalid, and deleted-user sessions; admin middleware has explicit early returns.
- Razorpay order creation and verification now require authentication.
- Razorpay amount is calculated from database product prices and quantities; client-supplied totals are ignored.
- Razorpay verification checks HMAC using a timing-safe comparison, fetches the payment from Razorpay, verifies captured status and amount, and prevents duplicate verification attempts.
- Orders persist before payment verification and retain the payment/order references.
- COD orders are supported for India; online Razorpay remains available.
- Order item prices and totals are generated server-side; product IDs, quantities, address and available stock are validated.
- Stock decrements use conditional atomic product updates; failed partial reservations are rolled back.
- Cancellation avoids restoring stock for unpaid Razorpay orders; COD/paid cancellation restores inventory and paid online orders are flagged for refund handling.
- COD orders become paid when marked delivered.
- Revenue analytics count paid orders only, with a compatibility fallback for older shipped/delivered records that predate paymentStatus.
- Product create/update validates price and stock, permits stock zero, requires an image on create, uploads to Cloudinary, and cleans temporary upload files.
- Product uploads are size-limited and restricted to accepted image MIME types; API errors return JSON.
- Order schema remains compatible with legacy `fulName` address fields and older order item snapshots.
- Updated seed data for the current order schema and payment statuses.
- Updated .gitignore for generated uploads and frontend build output.

## Remaining production blockers / follow-up work

1. **Payment expiry and stock reservation:** inventory is checked when a Razorpay order is created and atomically deducted only after capture. If stock sells out while the customer is paying, the captured payment is marked `refund_required`; support must arrange the refund. Add a reservation/expiry strategy and Razorpay webhook reconciliation before live payments.
2. **Refund execution:** refund-required orders are flagged, but automated Razorpay refunds are not implemented.
3. **Payment webhook:** the current verification flow depends on the authenticated client callback. Add a signed Razorpay webhook for reliable reconciliation when a customer closes the browser after payment.
4. **Shipping and tax:** server totals currently use product price × quantity only. Shipping fees, tax/GST, discounts and delivery eligibility rules are not yet implemented.
5. **Upload validation:** MIME and file-size checks are present; add file-signature/content inspection and Cloudinary asset cleanup for replaced/deleted products.
6. **Database migration:** old order records are kept readable, but a controlled migration should normalize legacy `fulName`, snapshot product names, and payment statuses after backing up MongoDB.
7. **Frontend integration:** no cart, checkout, login, service enquiry, WhatsApp, client CRM, or admin dashboard is complete yet.
8. **Testing:** no local React build, automated API tests, MongoDB integration tests, or Razorpay sandbox run has been performed in this remote source-edit session.

## Next engineering sequence

1. Pull `development` locally and run backend/frontend dependency installs and build checks.
2. Test register/login, admin product CRUD, stock validation, COD order creation/cancellation, Razorpay sandbox order/verification, duplicate callbacks, and revenue analytics.
3. Add payment webhook, refund workflow, payment expiry/reservation, shipping/tax rules and migration.
4. Build Services pages, interactive Theme Gallery, enquiry forms, WhatsApp routing and admin lead management.
5. Build Store catalogue, product detail, cart, checkout, account/order history and admin order workflows.
6. Only merge to `main` after explicit approval and passing tests.
