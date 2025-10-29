
const jwt = require('jsonwebtoken');
function authentecateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // console.log(token);
    if (token == null){
        return res.sendStatus(401);
    } 
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        console.log(req.user);
        next();
    });
}

module.exports = {
    authentecateToken
}