function adminMiddleware(req, res, next) {

    if (!req.user || req.user.claims.admin !== true) 
        return res.status(403).json({ error: 'Admin access is required!' });
next();

}
module.exports = adminMiddleware;