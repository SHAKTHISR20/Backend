const walletRepository = require('../repositories/walletRepository');
async function getBalance(uid) { return walletRepository.get(uid); }
async function getHistory(uid, limit) { return walletRepository.history(uid, limit); }


async function grant(uid, amount, reference, metadata = {}) { return walletRepository.adjust(uid, amount, 'credit', reference, metadata); }
async function spend(uid, amount, reference, metadata = {}) { return walletRepository.adjust(uid, -amount, 'debit', reference, metadata); }
module.exports = { getBalance, getHistory, grant, spend };
