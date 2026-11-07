const orderService = require('../services/orderService');
const cashfree = require('../services/cashfreeService');
const orders = require('../repositories/orderRepository');


async function create(req, res, next) {
try {
    const result = await orderService.createPaymentOrder(req.user.uid, req.body || {}, { email: req.user.email });
    res.status(201).json(result); 
    }
    catch (e) 
    { 
        next(e); 
    } 
}


async function status(req, res, next) {
try { 
    res.json(await orderService.refreshPaymentStatus(req.user.uid, req.params.orderId));
    } 
    catch (e) 
    { 
        next(e);
    }
}

async function webhook(req, res, next) {
try {
    const raw = req.body;
    const timestamp = req.headers['x-webhook-timestamp'];
    const signature = req.headers['x-webhook-signature'];
    if (!cashfree.verifyWebhook(raw, timestamp, signature)) 
        return res.status(401).json({ error: 'Invalid webhook signature' });

    const event = JSON.parse(raw.toString('utf8'));
    const data = event.data || {};
    const cfOrderId = data.order?.order_id || data.order_id;
    const cfStatus = data.payment?.payment_status || data.order?.order_status;

    if (cfOrderId && cfStatus) {
    const snap = await require('../config/firebase').db.collection('orders').where('providerOrderId', '==', cfOrderId).limit(1).get();

    if (!snap.empty) {
        const status = cfStatus === 'SUCCESS' || cfStatus === 'PAID' ? 'PAID' : cfStatus === 'FAILED' ? 'FAILED' : 'PENDING';
        await orders.update(snap.docs[0].id, { status, cashfreeStatus: cfStatus, webhookUpdatedAt: new Date()     
        });
    }
    }
    res.json({ received: true });
} catch (e) 
    { 
        next(e);
    }
}
module.exports = { create, status, webhook };
