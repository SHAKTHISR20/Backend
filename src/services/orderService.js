const crypto = require('crypto');
const orders = require('../repositories/orderRepository');
const cashfree = require('./cashfreeService');
async function createPaymentOrder(uid, input, user) {
  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount < 1 || amount > 100000 || Math.round(amount * 100) !== amount * 100) throw Object.assign(new Error('Amount must be between ₹1 and ₹100000, with at most 2 decimal places'), { statusCode: 400 });
  const orderId = `toya_${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`;
  const record = await orders.create({ uid, providerOrderId: orderId, amount, currency: 'INR', status: 'PENDING', paymentSessionId: null });
  try {
    const cfOrder = await cashfree.createOrder({ orderId, amount, customer: { id: uid, email: input.email || user.email, phone: input.phone }, returnUrl: input.returnUrl });
    await orders.update(record.id, { paymentSessionId: cfOrder.payment_session_id || null, cashfreeOrderId: cfOrder.order_id || orderId });
    return { orderId, paymentSessionId: cfOrder.payment_session_id, amount, currency: 'INR', status: 'PENDING' };
  } catch (e) {
    await orders.update(record.id, { status: 'CREATE_FAILED' }); throw e;
  }
}
async function refreshPaymentStatus(uid, orderId) {
  const matches = await orders.listForUser(uid, 100);
  const local = matches.find(o => o.providerOrderId === orderId || o.cashfreeOrderId === orderId);
  if (!local) throw Object.assign(new Error('Order not found'), { statusCode: 404 });
  const remote = await cashfree.getOrder(orderId);
  const status = remote.order_status === 'PAID' ? 'PAID' : remote.order_status === 'ACTIVE' ? 'PENDING' : remote.order_status || 'UNKNOWN';
  await orders.update(local.id, { status, cashfreeStatus: remote.order_status || null });
  return { orderId, status };
}
module.exports = { createPaymentOrder, refreshPaymentStatus };
