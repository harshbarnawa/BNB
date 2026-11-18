# BNB Service Enquiry Emails

## What happens when someone submits an enquiry?

1. The Express API validates the form and stores the enquiry in MongoDB first.
2. It attempts two transactional messages using the Resend HTTPS API:
   - BNB owner: New BNB enquiry, including contact details, project requirements, reference ID and the private admin dashboard link.
   - Customer: A branded thank-you, selected service and reference ID.
3. Each lead stores independent owner/customer email statuses: pending, sending, accepted, failed, or not_configured.
4. Accepted means Resend accepted the message for delivery processing, not that it reached the inbox. The form never promises inbox delivery.
5. A failed email does not delete the lead or turn a successful database save into a failed submission.
6. The protected admin dashboard displays email statuses and allows authorized manual retries of failed, unconfigured or legacy messages.

Resend idempotency keys are unique per lead and recipient type. The provider retains these keys for 24 hours.

## One-time setup

1. Sign in to https://resend.com and create a sending-only API key.
2. Verify ownership of a domain or subdomain at https://resend.com/domains by adding the DNS records Resend provides (including SPF/DKIM).
3. The shared test sender is not suitable for real customers; use your verified custom domain for actual recipient addresses.

On Render, open the existing bnb-enquiries-api-yam1 service, then Environment. Set:

- RESEND_API_KEY: Resend secret API key.
- LEAD_FROM_EMAIL: verified sender, e.g. BNB <hello@YOUR_VERIFIED_DOMAIN>. Replace the example with your own verified domain.
- LEAD_NOTIFICATION_EMAIL: owner inbox where every new enquiry alert should arrive.
- LEAD_REPLY_TO_EMAIL: optional reply-to inbox for customer acknowledgements; falls back to LEAD_NOTIFICATION_EMAIL.

Keep existing MONGO_URI, JWT_SECRET, NODE_ENV and FRONTEND_ORIGIN unchanged. No new frontend environment variables are needed.

Never put the API key in GitHub, chat, Vercel frontend settings, or any variable beginning REACT_APP_.

## Verification

1. Save the Render variables and deploy. Confirm the service is Live and /health returns HTTP 200.
2. Send one test enquiry from /services#enquiry using a mailbox you control.
3. Confirm the form returns a reference ID and displays whether the email was accepted by the provider.
4. In /admin/leads verify the owner and customer notifications show Accepted by email provider.
5. Check both real inboxes including Spam, then inspect the Resend Emails dashboard for delivery status or bounce information.
6. If a notification failed, fix the provider configuration and click Send / retry on that lead as admin.
7. Previous leads may show Not yet tracked. Admin can manually send for those older enquiries.

## Operational limits

- Email provider acceptance is not proof of inbox delivery. Resend's Events or verified webhooks are the delivery evidence.
- Free Render services sleep and can interrupt traffic. A basic in-memory IP limiter does not replace shared anti-spam protection.
- Before accepting production customer data at scale, add a suitable privacy policy, data retention/deletion procedures, monitoring, deliverability feedback and stronger abuse protection.
- This feature sends transactional enquiry emails, not marketing subscriptions.
