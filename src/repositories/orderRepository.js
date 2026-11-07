const { db } = require('../config/firebase');
const orders = db.collection('orders');
async function create(data){ 
    const ref = orders.doc(); 
    await ref.set({ ...data, createdAt: new Date(), 
        updatedAt: new Date() }); 
        return { id: ref.id, ...data }; 
}


async function getById(id){ 
    const snap = await orders.doc(id).get(); 
    return snap.exists ? { 
        id: snap.id, ...snap.data() 
    } : null;
}


async function update(id, data){ 
    await orders.doc(id).set({ ...data, updatedAt: new Date() }, 
    { merge: true }); 
    return getById(id); 
}


async function listForUser(uid, limit = 25){ 
    const snap = await orders.where('uid', '==', uid).orderBy('createdAt', 'desc').limit(limit).get(); 
    return snap.docs.map(d => ({ id: d.id, ...d.data() })); 
}
module.exports = { create, getById, update, listForUser };
