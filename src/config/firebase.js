const admin = require('firebase-admin');
let credential;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    credential = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    credential = admin.credential.cert(require(require('path').resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)));
  } else {
    throw new Error('Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON in .env');
  }
  if (!admin.apps.length) admin.initializeApp({ credential, projectId: process.env.FIREBASE_PROJECT_ID || undefined });
} catch (err) {
  
  throw new Error(`Firebase initialization has been failed: ${err.message}`);
}
const db = admin.firestore();
module.exports = { admin, db };

