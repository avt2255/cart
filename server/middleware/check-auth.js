const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    console.log(req.body);
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1]
            //decoding token
            const decodedToken = jwt.verify(token, 'secret_007')

            req.userData = { loginId: decodedToken.loginId }
            next()
        }
        //getting token from authorization


    } catch (error) {
        res.status(401).json({
            message: "Authentication failed !!! please login"
        })
        console.log(error);
    }
}