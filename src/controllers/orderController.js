const orders = require('../repositories/orderRepository');
async function list(req, res, next) { 
try { 
    res.json({ orders: await orders.listForUser(req.user.uid, Math.max(1, Math.min(100, Number(req.query.limit) || 25))) }); 
    }
    catch (e) 
    { 
        next(e);

    } 
}
async function get(req, res, next) { 
try {
    const order = await orders.getById(req.params.id);
    if (!order || order.uid !== req.user.uid)
        return res.status(404).json({ error: 'Order not found' }); 
        res.json({ order }); 
    } catch (e)
    { 
        next(e); 

    }
}
module.exports = { list, get };