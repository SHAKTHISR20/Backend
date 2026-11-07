const coins = require('../services/coinService');
async function balance(req, res, next) 
{ 
    try 
        { 
            res.json({ wallet: await coins.getBalance(req.user.uid) }); 
        } 
    catch (e)
    { 
        next(e);
    } 
}
async function history(req, res, next)
{ 
    try 
        { 
            const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 25)); res.json({ transactions: await coins.getHistory(req.user.uid, limit) });
        }
    catch (e) 
    { 
        next(e); 
    }
}
module.exports = { balance, history };
