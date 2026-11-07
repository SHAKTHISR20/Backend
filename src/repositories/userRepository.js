const { db } = require('../config/firebase');

const users = db.collection('users');

async function getById(uid) { 
    const snap = await users.doc(uid).get(); 
    return snap.exists ? { 
        id: snap.id, ...snap.data() 
    } : null; 
}


async function createIfMissing(uid, data = {}) {
  const ref = users.doc(uid);
  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) tx.set(ref, { email: data.email || null, displayName: data.displayName || null, createdAt: new Date(), updatedAt: new Date(), role: 'user' });
  });
  return getById(uid);
}


async function update(uid, data) {
  const allowed = {};
  if (typeof data.displayName === 'string') allowed.displayName = data.displayName.trim().slice(0, 100);

  if (typeof data.photoURL === 'string') allowed.photoURL = data.photoURL.slice(0, 1000);

  allowed.updatedAt = new Date();

  await users.doc(uid).set(allowed, { merge: true });
  
  return getById(uid);
}
module.exports = { getById, createIfMissing, update };
