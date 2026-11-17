# BNB implementation audit

Audit date: 2026-11-17
Repository: harshbarnawa/BNB
Default branch: main
Working branch: development (created from main)

## Repository state

- Before this work, main was the only branch. The development branch now exists and is the only branch receiving implementation commits.
- Main remains at its original commit (91f84f9d322a338d24bdac2f0891ceb3018c51c3); no files or commits have been written to main.
- Backend has an Express/Mongoose structure for authentication, products, orders, Razorpay payments, admin analytics, Cloudinary uploads, and email.
- Frontend was a Create React App placeholder. A first responsive BNB homepage shell has now been added on development: shared brand navigation, Digital Services + Tech Store split paths, service overview, six gallery categories, illustrative product previews, about and contact sections.
- The frontend is not yet build-tested in a local runtime; the current changes are source-level work only.
- notes.txt documents the original build sequence and records that frontend work had only just started after backend/Postman work.

## Confirmed backend issues from source review

1. Linux import-case mismatch was present: files were named authMIddleware.js/adminMIddleware.js while imports requested authMiddleware.js/adminMiddleware.js. Correctly cased files have now been created and the incorrectly cased files removed on development.
2. Payment endpoints are public: POST /api/payments/order and POST /api/payments/verify have no authentication middleware.
3. Payment amount is client-controlled: createdOrder uses req.body.amount directly to create the Razorpay order. The server does not derive the amount from trusted product prices and quantities.
4. Order creation trusts client-supplied items and totalAmount without reloading products, validating stock, or recalculating totals.
5. Order schema requires paymentId, which does not accommodate COD orders where there may be no online payment ID.
6. Analytics counts every order's totalAmount as revenue; pending/unpaid orders can inflate revenue.
7. Product image is required in the schema, but createProduct starts with an empty imageUrl when no upload is supplied. The API will reject such a product at save time; this should be an explicit validation or schema decision.
8. Product update uses value || existingValue for price and stock, preventing intentional updates to numeric zero.
9. Multer writes uploaded files to a local uploads directory; temporary file cleanup and production storage behavior need review.
10. Order address field is named fulName; correct naming/migration compatibility should be considered before changing persisted schema.
11. .gitignore currently does not exclude the backend uploads directory; uploaded files are already present in the repository tree and need a careful cleanup decision rather than blind deletion.

## Current implementation direction

- Preserve the existing backend rather than rewrite it.
- Stabilize and secure the commerce flow before connecting a live checkout.
- Support COD as a payment method, while retaining online Razorpay payments.
- Do not show sample seed products as real available inventory.
- Build BNB as one shared brand with two clear paths: Digital Services and Tech Store.
- Approved visual direction: premium black/white foundation with mint accent #16B98A.
- Services: packages and custom projects, milestone payments, client handover, client-owned commissioned deliverables, limited bug-fix window and optional maintenance, enquiry form + WhatsApp, lead tracking, contracts, real portfolio + clearly labelled interactive demos.
- Store: PC and tech accessories, phased launch, hybrid inventory and fulfilment, COD for eligible Indian orders, and online prepayment for international orders.
- Keep main untouched. All implementation work belongs on development until explicitly approved for merge.

## Next engineering sequence

1. Complete and locally build-test the public website shell.
2. Add Services landing, Theme Gallery detail pages, real-project portfolio structure and enquiry flow.
3. Add Store catalogue/product detail/cart/checkout UI using clearly labelled demo data.
4. Fix backend order validation, payment verification, COD model, inventory handling and revenue calculations.
5. Add admin workflows for products, orders, service leads and project enquiries.
6. Run build/API/security tests before any deployment or merge.