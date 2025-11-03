
const jwt = require('jsonwebtoken');
function authentecateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // console.log(token);
    if (token == null){
        return res.sendStatus(401);
    } 
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
        req.user = user;
        console.log(req.user);
        next();
    });
}

// Middleware to check user roles
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const userRole = req.user.role;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${allowedRoles.join(" or ")}`
            });
        }

        next();
    };
}

module.exports = {
    authentecateToken,
    authorizeRoles
}