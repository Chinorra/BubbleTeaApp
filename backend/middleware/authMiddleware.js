const jwt = require('jsonwebtoken')
const privateKey = process.env.PRIVATE_KEY

const authMiddleware = (req,res, next) => {
    try {
        const bearerToken = req.headers.authorization;
        const token = bearerToken.split(' ')[1];
        if (token) {
            const userData = jwt.verify(token, privateKey);
            console.log('userData: ', userData);
            req.user = userData;
            next();
        }
    } catch (error) {
        res.status(400).json({
            msg: "Invalid token",
            error: error
        })
    }
}

module.exports = {authMiddleware}