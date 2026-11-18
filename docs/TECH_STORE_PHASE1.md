# BNB Tech Store — Phase 1 (functional storefront)

## Routes

- `/store` — full responsive e-commerce storefront, product search, eight hardware categories, client-side filters, pricing sort, product detail previews, saved items and an interactive **demo-only** bag
- `/admin/store` — authenticated admin product manager using existing BNB admin login
- `/admin/leads` — "Manage store" link, alongside existing leads and pricing
- `/privacy` — enquiry privacy notice

The homepage's Tech Store section and site navigation link to `/store`. The existing Digital Services and enquiries remain available.

## Store behaviour

The page loads real published items through `GET /api/store/products`. If there are no published items, it displays 12 labelled fictitious product demos with original SVG illustrations and **illustrative prices**.

- Demo products support search, filtering, product details, wishlist and a local demo bag.
- The demo bag never submits an order, collects card data or checks out.
- Once an admin publishes at least one real listing, the page opens the live catalogue by default, with an optional switch to explore the sample demo.
- Real "showcase" listings display an enquiry link to the business email, not a purchase button.
- Real "affiliate" listings display an external HTTPS purchase link with `rel="sponsored noopener noreferrer"`. A disclosure explains potential commissions and that the retailer handles payment/returns.
- No live purchase is implied. Inventory ownership, delivery, warranty, merchant eligibility and returns are **not implemented**.
- No fake ratings, fictitious sales volume, invented stock quantities, or unauthorised product photography.

## Adding a product

1. Open `https://boardnbyte.vercel.app/admin/store` and sign in as an existing admin.
2. Fill product name, category, brand, description, and optionally price and compare-at price.
3. Paste an HTTPS image URL you are licensed to display (Cloudinary or a supplier-authorised image). If blank, a matching BNB illustration is shown.
4. Choose **Enquiry only** (no payment) or **Affiliate / retailer link**. For affiliate mode you must add a valid, approved HTTPS retailer link.
5. Keep **Publish** unticked to save a draft; enable it only when you approve the details. Select **Featured** for recommended placement.
6. Save and open `/store`. Published listings appear through the existing Render/MongoDB API.

Affiliate programmes, contracts, required disclosure terms and payout requirements must be arranged with the retailer separately. Do not scrape product listings, assume commissions, or claim items are in stock when no supplier has confirmed that.

## API

Uses the existing Render enquiries app and MongoDB Atlas:
- `GET /api/store/products` — published catalogue only, limited to 150 results
- `GET /api/store/admin/products` — admin JWT only, max 200
- `POST /api/store/admin/products` — admin JWT, validated JSON
- `PUT /api/store/admin/products/:id` — admin JWT, full validated replacement
- `DELETE /api/store/admin/products/:id` — admin JWT

The model `StoreListing` is separate from the older `Product` model so this phase does not alter legacy checkout/order work.

## Deferred until ready

Direct checkout, inventory, dropshipping, COD, shipping integrations, customer accounts, refund automation, supplier onboarding and affiliate account registrations. None are needed to demonstrate the UI or acquire the first Digital Services client.
