# Airport intake launch checklist

Implemented: Korean/English preparation, authenticated intake, exact v2 agreement snapshot + hash + typed name signature, PayPal hosted checkout, explicit payment-review status, email delivery instructions and restricted administrator verification. A customer payment report is never treated as verified payment.

## Current document delivery — 2026-09-28

The client signs and pays online, then emails actual case documents to info@kimnhyun.com with the case reference. New customer web uploads are disabled at the API (410 EMAIL_DOCUMENTS_ONLY, without reading multipart data or writing to storage). The mailto button opens a composer only; it neither attaches files nor confirms delivery. Receipt is checked in the office mailbox. Existing stored files remain accessible only to their authorized owners/admins; email attachments do not appear in that historical file list. Website contract snapshots, consents and payment records continue to use Supabase. Privacy notice version: airport-privacy-email-v2-20260928.

Production intake was enabled and opened on 2026-09-28. Older verification entries below document the earlier disabled state and former upload flow, not current availability. Live payment/refund testing remains separate and incomplete.

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

Hosted mode is default and requires no PayPal API secret. On return, customer supplies PayPal transaction reference; status becomes `payment_review`, and email document instructions are displayed immediately. Staff verifies actual merchant receipt, payer, USD 3300.00, and transaction ID before marking `paid`. Initial contact deadlines remain obligations even while payment verification is pending; monitor the PayPal merchant notification as well. Match incoming document emails by case reference and reply to confirm receipt.

The hosted link may be shared or revisited outside this flow; signature-first and single-case limits are enforced on this site, not inside PayPal. Off-flow payments require manual matching/signature or refund. Do not claim absolute payment exclusion or automatic payment verification in this mode.

Optional API mode: `AIRPORT_PAYMENT_MODE=api`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, and `PAYPAL_ENV=live` (otherwise sandbox). Server creates immutable USD 3300.00 orders, captures them with idempotency keys and verifies amount, currency, case identifier and completed capture. This mode needs separate sandbox and live validation before use and does not use the hosted link.

## Operational checks

- Booking timeout is 30 minutes until checkout starts. Starting checkout reserves the desk until staff reconciles/releases it; never blindly release a payable API order.
- One case at a time. Closing the desk blocks new cases; existing cases can finish.
- New web uploads are disabled. Historical web-file downloads expire in 60 seconds and force attachment. Email attachments are not automatically ingested or malware-scanned by the website; staff must use protected viewers and avoid active content.
- Check receipt alerts, signed contract download, payment cancellation, duplicate payments, refunds, file rejection, permissions, retention/deletion procedure and recovery after browser closure.
- No Google Ads purchase conversion is emitted on return-page visits or customer self-report. Upload verified conversions separately after matching actual payments.
- Current signature records email-authenticated user, supplied signer/authority, complete agreement + version/hash and server timestamp. This is not identity verification or a qualified digital signature. Verify representative authority before substantive action.
- The exact v2 agreement includes a separately signed jurisdiction clause. Website signature does not separately opt into exclusive jurisdiction. Read the fallback wording; do not assume exclusive jurisdiction was selected.

## Deployment status

Source code and UI can deploy in unavailable mode without collecting personal data. Production operation remains gated by the above environment variables and migration. Do not represent a build or mocked UI test as a completed live payment/upload test.

## Verified connection update — 2026-09-28

- Production SUPABASE_SERVICE_ROLE_KEY registered in Vercel (secret).
- Resend existing kimnhyun.com domain was already verified. Dedicated sending-only key restricted to that domain registered as RESEND_API_KEY in Vercel Production and Supabase custom SMTP.
- SMTP persisted after reload: info@kimnhyun.com, Kim & Hyun | Korea Visa Law, smtp.resend.com:465, username resend. Credentials are not stored in this document.
- AIRPORT_NOTIFY_FROM and AIRPORT_NOTIFY_TO configured for info@kimnhyun.com.
- PayPal saved and verified: USD 3300, quantity 1, no shipping address, return URL https://koreavisalaw.com/en/entry-refusal/apply.
- Both exact Supabase authentication redirect URLs registered.
- Commit 8933ab2 deployed successfully; KO/EN apply pages return 200 and noindex. API returns ready=false/open=false.
- Still pending: actual email-delivery test, end-to-end owner isolation / signing / payment report / document tests, approved bilingual privacy notice and retention policy, final desk opening. Do not claim live intake is enabled.
- First unused airport mail key remains in Resend following interrupted setup; v2 is the configured key. Review/revoke unused key with applicable confirmation before cleanup.


## Verification update — 2026-09-28 (second pass)

- Bilingual airport-specific privacy notice implemented in lib/airport-privacy.ts. General processing and international transfer controls precede email authentication; sensitive data consent is separate and optional. ID/passport numbers must be masked.
- Retention is an office policy: evidence/contract/payment records five years after closure, uploads 90 days, unsuccessful applications 90 days, test records seven days. Monthly staff review is required; automatic deletion is NOT implemented or claimed.
- English title localized. Build passed.
- tests/airport-flow.cjs: 23 checks passed against the actual route and contract modules with isolated in-memory provider doubles. Covers owner isolation, signatures, consent, slot protection, hosted payment reporting, admin-only verification, upload validation and optional PayPal fixture reconciliation. This is NOT live PayPal or live storage upload testing.
- Actual Supabase signInWithOtp to the existing office account succeeded; Resend email 01a0e774-80b4-72b4-a219-5be35194fa33 shows Delivered. User click/session confirmation pending.
- Live anonymous SELECT on all three airport tables returned PostgreSQL 42501; private bucket listing disclosed no files.
- No actual payment, live contract signing or customer document was submitted. AIRPORT_ENABLED remains off.
