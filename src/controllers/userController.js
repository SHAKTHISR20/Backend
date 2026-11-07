const users = require('../repositories/userRepository');
async function me(req, res, next)
{ 
try 
    { const user = await users.createIfMissing(req.user.uid, 
        { email: req.user.email, displayName: req.user.claims.name }); res.json({ user });
    } 
    catch (e)
    {
        next(e);

    } 
}
async function updateMe(req, res, next) 
{ 
try
    { 
        const user = await users.update(req.user.uid, req.body || {});  res.json({ user });
    } 
    catch (e)
    { next(e);

    } 
}
module.exports = { me, updateMe };