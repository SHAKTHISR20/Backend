const { db } = require('../config/firebase');
async function requestWithdrawal(req, res, next) {
try {
    const amount = Number(req.body?.amount);
    if (!Number.isSafeInteger(amount) || amount < 1 || amount > 1000000) return res.status(400).json({ error: 'amount must be a whole number of coins between 1 and 1,000,000' });


    // Request is queued for admin review; no cash is sent and no coins are deducted here.

    const ref = await db.collection('cashRequests').add({ uid: req.user.uid, amount, status: 'PENDING_REVIEW', createdAt: new Date(), updatedAt: new Date() });
    res.status(201).json({ requestId: ref.id, status: 'PENDING_REVIEW', message: 'Withdrawal request submitted for review' });
    } 
catch (e) 
{ 
    next(e); 
}
}



async function myRequests(req, res, next) {
try 
    { const snap = await db.collection('cashRequests').where('uid', '==', req.user.uid).orderBy('createdAt', 'desc').limit(50).get(); res.json({ requests: snap.docs.map(d => ({ id: d.id, ...d.data() })) });
    } 
catch (e)
{ 
    next(e); 
}
}
module.exports = { requestWithdrawal, myRequests };
