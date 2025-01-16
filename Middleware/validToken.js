const jwt = require('jsonwebtoken');

const validTokens = (req, res, next) => {
    const authHeader = req.headers.Authorization || req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).json({message: "user is not authorized"});
        }
        req.user = decoded;
        next();
    })
};
module.exports = validTokens;
