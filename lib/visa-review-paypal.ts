import { createHash } from 'node:crypto';

type ErrorCode = 'unavailable' | 'invalid-input' | 'payment-mismatch' | 'not-approved' | 'capture-pending' | 'provider-error';

export class PayPalReviewError extends Error {
  readonly code: ErrorCode;
  readonly providerStatus?: number;

  constructor(code: ErrorCode, providerStatus?: number) {
    super({
      unavailable: 'Visa review payments are unavailable.',
      'invalid-input': 'The payment request is invalid.',
      'payment-mismatch': 'This payment could not be verified for the visa review.',
      'not-approved': 'This payment has not been approved and completed.',
      'capture-pending': 'PayPal has not confirmed the payment yet.',
      'provider-error': 'PayPal could not complete the request.',
    }[code]);
    this.name = 'PayPalReviewError';
    this.code = code;
    this.providerStatus = providerStatus;
  }
}

type Money = { currency_code?: string; value?: string };
type Link = { rel?: string; href?: string };
type Refund = { id?: string; status?: string; amount?: Money; custom_id?: string };
type Capture = {
  id?: string;
  status?: string;
  amount?: Money;
  custom_id?: string;
  create_time?: string;
  update_time?: string;
  links?: Link[];
  supplementary_data?: { related_ids?: { order_id?: string } };
};
type Order = {
  id?: string;
  intent?: string;
  status?: string;
  links?: Link[];
  purchase_units?: Array<{
    custom_id?: string;
    amount?: Money;
    payments?: { captures?: Capture[]; refunds?: Refund[] };
  }>;
};

function paymentConfig() {
  const mode = process.env.VISA_REVIEW_PAYPAL_ENV?.trim() || 'sandbox';
  const clientId = process.env.VISA_REVIEW_PAYPAL_CLIENT_ID?.trim();
  const clientSecret = process.env.VISA_REVIEW_PAYPAL_CLIENT_SECRET?.trim();
  if ((mode !== 'sandbox' && mode !== 'live') || !clientId || !clientSecret) return null;

  return {
    baseUrl: mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com',
    approveHost: mode === 'live' ? 'www.paypal.com' : 'www.sandbox.paypal.com',
    basicAuth: Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
  };
}

export function reviewPaymentReady() {
  return paymentConfig() !== null;
}

function providerId(value?: string): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9-]{1,64}$/.test(value);
}

function checkInput(caseId: string, amountCents: number) {
  if (!/^[A-Za-z0-9_-]{1,127}$/.test(caseId) || !Number.isSafeInteger(amountCents) || amountCents <= 0) {
    throw new PayPalReviewError('invalid-input');
  }
}

function usd(cents: number) {
  return { currency_code: 'USD', value: `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, '0')}` };
}

function sameAmount(amount: Money | undefined, amountCents: number) {
  if (amount?.currency_code !== 'USD' || typeof amount.value !== 'string') return false;
  const match = /^(0|[1-9]\d*)(?:\.(\d{1,2}))?$/.exec(amount.value);
  if (!match) return false;
  const cents = Number(match[1]) * 100 + Number((match[2] || '').padEnd(2, '0'));
  return Number.isSafeInteger(cents) && cents === amountCents;
}

function requestId(operation: string, ...parts: string[]) {
  return createHash('sha256').update(JSON.stringify(['visa-review', operation, ...parts])).digest('hex').slice(0, 36);
}

function parseUrl(value: string | undefined) {
  if (!value) return undefined;
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}

function checkedCallback(value: string) {
  const url = parseUrl(value);
  if (!url || url.username || url.password || (url.protocol !== 'https:' &&
    !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname)))) {
    throw new PayPalReviewError('invalid-input');
  }
  return url.toString();
}

async function jsonRequest<T>(url: string, init: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...init,
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) throw new PayPalReviewError('provider-error', response.status);
    return await response.json() as T;
  } catch (error) {
    if (error instanceof PayPalReviewError) throw error;
    throw new PayPalReviewError('provider-error');
  }
}

async function paymentClient() {
  const config = paymentConfig();
  if (!config) throw new PayPalReviewError('unavailable');
  const { baseUrl, approveHost, basicAuth } = config;
  const token = await jsonRequest<{ access_token?: string }>(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const accessToken = token?.access_token;
  if (typeof accessToken !== 'string' || !accessToken) throw new PayPalReviewError('provider-error');

  function get<T>(path: string) {
    return jsonRequest<T>(`${baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }

  function post<T>(path: string, body: unknown, id: string) {
    return jsonRequest<T>(`${baseUrl}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': id,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(body),
    });
  }

  return { get, post, approveHost };
}

export async function createReviewPayPalOrder(input: {
  caseId: string;
  amountCents: number;
  returnUrl: string;
  cancelUrl: string;
  idempotencyKey: string;
}) {
  const { caseId, amountCents, idempotencyKey } = input;
  checkInput(caseId, amountCents);
  if (!idempotencyKey || idempotencyKey.length > 200) throw new PayPalReviewError('invalid-input');
  const returnUrl = checkedCallback(input.returnUrl);
  const cancelUrl = checkedCallback(input.cancelUrl);
  const client = await paymentClient();
  const order = await client.post<Order>('/v2/checkout/orders', {
    intent: 'CAPTURE',
    purchase_units: [{ custom_id: caseId, amount: usd(amountCents) }],
    payment_source: {
      paypal: {
        experience_context: {
          return_url: returnUrl,
          cancel_url: cancelUrl,
          user_action: 'PAY_NOW',
          shipping_preference: 'NO_SHIPPING',
        },
      },
    },
  }, requestId('create', caseId, String(amountCents), idempotencyKey));

  const approval = parseUrl(order.links?.find(link => link.rel === 'payer-action' || link.rel === 'approve')?.href);
  if (!providerId(order.id) || !approval || approval.protocol !== 'https:' ||
    approval.host !== client.approveHost || approval.username || approval.password ||
    approval.searchParams.get('token') !== order.id) {
    throw new PayPalReviewError('provider-error');
  }
  return { orderId: order.id, approvalUrl: approval.toString() };
}

function verifyOrder(order: Order, orderId: string, caseId: string, amountCents: number) {
  const purchaseUnit = order.purchase_units?.[0];
  if (order.id !== orderId || order.intent !== 'CAPTURE' || order.purchase_units?.length !== 1 ||
    purchaseUnit?.custom_id !== caseId || !sameAmount(purchaseUnit.amount, amountCents)) {
    throw new PayPalReviewError('payment-mismatch');
  }
  return purchaseUnit;
}

function verifyCapture(order: Order, orderId: string, caseId: string, amountCents: number) {
  const purchaseUnit = verifyOrder(order, orderId, caseId, amountCents);
  const captures = purchaseUnit.payments?.captures;
  const capture = captures?.[0];
  if (order.status !== 'COMPLETED' || capture?.status !== 'COMPLETED') {
    throw new PayPalReviewError('capture-pending');
  }
  if (captures?.length !== 1 || !providerId(capture.id) || !sameAmount(capture.amount, amountCents) ||
    (capture.custom_id !== undefined && capture.custom_id !== caseId)) {
    throw new PayPalReviewError('payment-mismatch');
  }
  const timestamp = Date.parse(capture.update_time ?? capture.create_time ?? '');
  const capturedAt = Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : undefined;
  return { orderId, captureId: capture.id, ...(capturedAt ? { capturedAt } : {}) };
}

export async function captureReviewPayPalOrder(input: { orderId: string; caseId: string; amountCents: number; existingOnly?: boolean }) {
  const { orderId, caseId, amountCents, existingOnly } = input;
  checkInput(caseId, amountCents);
  if (!providerId(orderId)) throw new PayPalReviewError('invalid-input');
  const client = await paymentClient();
  const path = `/v2/checkout/orders/${orderId}`;
  const order = await client.get<Order>(path);
  verifyOrder(order, orderId, caseId, amountCents);
  if (order.status === 'COMPLETED') return verifyCapture(order, orderId, caseId, amountCents);
  if (existingOnly || order.status !== 'APPROVED') throw new PayPalReviewError('not-approved');

  let captureError: unknown;
  try {
    await client.post<Order>(`${path}/capture`, {}, requestId('capture', orderId));
  } catch (error) {
    captureError = error;
  }
  // The capture response may omit the order's custom ID. The full order also resolves concurrent captures and lost responses.
  try {
    const completed = await client.get<Order>(path);
    return verifyCapture(completed, orderId, caseId, amountCents);
  } catch (error) {
    if (error instanceof PayPalReviewError && error.code === 'payment-mismatch') throw error;
    throw captureError ?? error;
  }
}

export async function refundReviewPayPalCapture(input: {
  captureId: string;
  caseId: string;
  amountCents: number;
  refundAmountCents?: number;
  operationId?: string;
  reason?: string;
  reconcileOnly?: boolean;
  orderId?: string;
  refundId?: string;
}) {
  const { captureId, caseId, amountCents, orderId, refundId, operationId, reason, reconcileOnly } = input;
  const refundAmountCents = input.refundAmountCents ?? amountCents;
  checkInput(caseId, amountCents);
  checkInput(caseId, refundAmountCents);
  if (!providerId(captureId) || (orderId !== undefined && !providerId(orderId)) ||
    (refundId !== undefined && !providerId(refundId)) || refundAmountCents > amountCents ||
    (operationId !== undefined && !providerId(operationId))) {
    throw new PayPalReviewError('invalid-input');
  }
  const client = await paymentClient();
  const path = `/v2/payments/captures/${captureId}`;
  const capture = await client.get<Capture>(path);
  if (capture.id !== captureId || !sameAmount(capture.amount, amountCents) ||
    (capture.custom_id !== undefined && capture.custom_id !== caseId) ||
    !['COMPLETED', 'PARTIALLY_REFUNDED', 'REFUNDED'].includes(capture.status ?? '')) {
    throw new PayPalReviewError('payment-mismatch');
  }

  const up = parseUrl(capture.links?.find(link => link.rel === 'up')?.href);
  const linkedOrder = capture.supplementary_data?.related_ids?.order_id ??
    up?.pathname.match(/^\/v2\/checkout\/orders\/([A-Za-z0-9-]{1,64})$/)?.[1];
  const verifiedOrderId = orderId ?? linkedOrder;
  if (orderId && linkedOrder && orderId !== linkedOrder) throw new PayPalReviewError('payment-mismatch');
  let recordedRefunds: Refund[] = [];
  if (providerId(verifiedOrderId)) {
    const order = await client.get<Order>(`/v2/checkout/orders/${verifiedOrderId}`);
    const purchaseUnit = verifyOrder(order, verifiedOrderId, caseId, amountCents);
    const captures = purchaseUnit.payments?.captures;
    recordedRefunds = purchaseUnit.payments?.refunds ?? [];
    if (order.status !== 'COMPLETED' || captures?.length !== 1 || captures[0].id !== captureId ||
      !sameAmount(captures[0].amount, amountCents)) {
      throw new PayPalReviewError('payment-mismatch');
    }
  } else if (capture.custom_id !== caseId) {
    throw new PayPalReviewError('payment-mismatch');
  }

  async function findRecordedRefund(refunds: Refund[]) {
    if (!operationId) return undefined;
    for (const entry of refunds) {
      if (!providerId(entry.id)) throw new PayPalReviewError('provider-error');
      const details = await client.get<Refund>(`/v2/payments/refunds/${entry.id}`);
      if (details.custom_id === operationId) return details;
    }
    return undefined;
  }

  let refund = refundId
    ? await client.get<Refund>(`/v2/payments/refunds/${refundId}`)
    : await findRecordedRefund(recordedRefunds);
  if (!refund) {
    if (reconcileOnly) throw new PayPalReviewError('provider-error');
    try {
      refund = await client.post<Refund>(`${path}/refund`, {
        amount: usd(refundAmountCents),
        ...(operationId ? {custom_id: operationId} : {}),
        ...(reason ? {note_to_payer: reason.slice(0, 255)} : {}),
      }, requestId('refund', captureId, caseId, ...(operationId ? [operationId] : [])));
    } catch (error) {
      if (!operationId || !providerId(verifiedOrderId)) throw error;
      const current = await client.get<Order>(`/v2/checkout/orders/${verifiedOrderId}`);
      const unit = verifyOrder(current, verifiedOrderId, caseId, amountCents);
      refund = await findRecordedRefund(unit.payments?.refunds ?? []);
      if (!refund) throw error;
    }
  }
  if (!providerId(refund.id) || !sameAmount(refund.amount, refundAmountCents) ||
    (operationId !== undefined && refund.custom_id !== operationId) ||
    (refundId !== undefined && refund.id !== refundId) ||
    !['COMPLETED', 'PENDING', 'FAILED', 'CANCELLED'].includes(refund.status ?? '')) {
    throw new PayPalReviewError('provider-error');
  }
  return { refundId: refund.id, status: refund.status as 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED' };
}
