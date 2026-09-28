# Airport intake launch checklist

Implemented: Korean/English preparation, authenticated intake, exact v2 agreement snapshot + hash + typed name signature, private file uploads, PayPal hosted checkout, explicit payment-review status, restricted administrator verification and file downloads. A customer payment report is never treated as verified payment.

## Required configuration before enabling intake

1. Apply `database/airport-intake.sql` to the existing Supabase project, review the restrictive storage policy, and verify the bucket is private.
2. Configure server-only `SUPABASE_SERVICE_ROLE_KEY`. Preserve the project's existing `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Never commit secrets.
3. Supabase Auth: enable customer email login, production SMTP, and allow `https://koreavisalaw.com/ko/entry-refusal/apply` and its English counterpart as redirect URLs. Verify two different customer accounts cannot access one another's contracts or documents. Existing office admins must satisfy `is_visa_content_admin()`.
4. Set `AIRPORT_PRIVACY_KO` and `AIRPORT_PRIVACY_EN` to the approved actual privacy/overseas transfer notice, including provider/legal recipient, country, data, purposes, retention period, transfer timing and method, refusal consequences, office privacy contact, and handling of passport/health/criminal information. Do not invent hosting locations or retention periods.
5. Configure `RESEND_API_KEY`, `AIRPORT_NOTIFY_FROM` (verified sending domain) and `AIRPORT_NOTIFY_TO` (office recipient). Notification contains case ID only. Test deliverability and use the office queue as backup.
6. Set `AIRPORT_ENABLED=true` only after end-to-end tests. The desk starts closed. Office admin opens `/admin/airport` only when able to meet the contract's first-contact commitment.

## PayPal

Authorized hosted link: `https://www.paypal.com/ncp/payment/7DDC3PVGKV7KJ`.
Confirmed in PayPal business UI: USD 3,300. Initially quantity allowed 2 and shipping address collection enabled; these must be turned off. Return URL: `https://koreavisalaw.com/en/entry-refusal/apply`.

Hosted mode is default and requires no PayPal API secret. On return, customer supplies PayPal transaction reference; status becomes `payment_review`, and document upload is permitted immediately. Staff verifies actual merchant receipt, payer, USD 3300.00, and transaction ID before marking `paid`. Initial contact deadlines remain obligations even while payment verification is pending; monitor the PayPal merchant notification as well.

The hosted link may be shared or revisited outside this flow; signature-first and single-case limits are enforced on this site, not inside PayPal. Off-flow payments require manual matching/signature or refund. Do not claim absolute payment exclusion or automatic payment verification in this mode.

Optional API mode: `AIRPORT_PAYMENT_MODE=api`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, and `PAYPAL_ENV=live` (otherwise sandbox). Server creates immutable USD 3300.00 orders, captures them with idempotency keys and verifies amount, currency, case identifier and completed capture. This mode needs separate sandbox and live validation before use and does not use the hosted link.

## Operational checks

- Booking timeout is 30 minutes until checkout starts. Starting checkout reserves the desk until staff reconciles/releases it; never blindly release a payable API order.
- One case at a time. Closing the desk blocks new cases; existing cases can finish.
- File limit: PDF/JPEG/PNG, 3 MB per file, 20 files. File signatures are validated and names stored only in a private table. Downloads expire in 60 seconds and force attachment. There is no malware-scanning service yet; staff must use protected viewers and avoid active content.
- Check receipt alerts, signed contract download, payment cancellation, duplicate payments, refunds, file rejection, permissions, retention/deletion procedure and recovery after browser closure.
- No Google Ads purchase conversion is emitted on return-page visits or customer self-report. Upload verified conversions separately after matching actual payments.
- Current signature records email-authenticated user, supplied signer/authority, complete agreement + version/hash and server timestamp. This is not identity verification or a qualified digital signature. Verify representative authority before substantive action.
- The exact v2 agreement includes a separately signed jurisdiction clause. Website signature does not separately opt into exclusive jurisdiction. Read the fallback wording; do not assume exclusive jurisdiction was selected.

## Deployment status

Source code and UI can deploy in unavailable mode without collecting personal data. Production operation remains gated by the above environment variables and migration. Do not represent a build or mocked UI test as a completed live payment/upload test.
