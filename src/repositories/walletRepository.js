const { db } = require('../config/firebase');
const wallets = db.collection('wallets');
const ledger = db.collection('walletLedger');


async function get(uid) {
  const snap = await wallets.doc(uid).get();
  return snap.exists ? { balance: Number(snap.data().balance || 0), updatedAt: snap.data().updatedAt || null } : { balance: 0, updatedAt: null };
}


async function adjust(uid, amount, type, reference, metadata = {}) {
  if (!Number.isSafeInteger(amount) || amount === 0) throw Object.assign(new Error('Amount must be an integer number of coins'), { statusCode: 400 });


  const walletRef = wallets.doc(uid); 
  const ledgerRef = ledger.doc();
  await db.runTransaction(async tx => {

    const snap = await tx.get(walletRef);
    const current = snap.exists ? Number(snap.data().balance || 0) : 0;
    const next = current + amount;

    if (next < 0) throw Object.assign(new Error('Insufficient coin balance'), { statusCode: 400 });
    tx.set(walletRef, { balance: next, updatedAt: new Date() }, { merge: true });
    tx.set(ledgerRef, { uid, amount, type, reference: reference || null, metadata, createdAt: new Date() });
  });

  return get(uid);
}

async function history(uid, limit = 25) {
  const snap = await ledger.where('uid', '==', uid).orderBy('createdAt', 'desc').limit(limit).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
module.exports = { get, adjust, history };
