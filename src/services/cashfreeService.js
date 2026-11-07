
const crypto = require('crypto');

const {
  cashfreeBaseUrl,
  cashfreeHeaders
} = require('../config/cashfree');


async function request(path, options = {}) {
  const response = await fetch(
    `${cashfreeBaseUrl()}${path}`,
    {
      ...options,
      headers: {
        ...cashfreeHeaders(),
        ...(options.headers || {})
      }
    }
  );

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      body.message ||
      body.message_text ||
      'Cashfree request failed'
    );

    error.statusCode = 502;
    throw error;
  }

  return body;
}

async function createOrder({
  orderId,
  amount,
  customer,
  returnUrl
}) {
  return request('/orders', {
    method: 'POST',

    headers: {
      'x-idempotency-key': orderId
    },

    body: JSON.stringify({
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',

      customer_details: {
        customer_id: customer.id,
        customer_email: customer.email || undefined,
        customer_phone: customer.phone || undefined
      },

      order_meta: returnUrl
        ? { return_url: returnUrl }
        : undefined
    })
  });
}


async function getOrder(orderId) {
  return request(
    `/orders/${encodeURIComponent(orderId)}`,
    {
      method: 'GET'
    }
  );
}


function verifyWebhook(rawBody, timestamp, signature) {
  const secret = process.env.CASHFREE_WEBHOOK_SECRET;

  if (
    !secret ||
    !timestamp ||
    !signature ||
    !Buffer.isBuffer(rawBody)
  ) {
    return false;
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(
      String(timestamp) + rawBody.toString('utf8')
    )
    .digest('base64');

  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    expectedBuffer,
    signatureBuffer
  );
}

module.exports = {
  createOrder,
  getOrder,
  verifyWebhook
};
