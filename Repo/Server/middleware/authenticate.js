const jwt = require('jsonwebtoken');
const {Merchant} = require('../models/merchant');
const CONFIG = require('../config');
 
const authenticate = async(req, res, next) => {

    let token = req.header('x-auth');

    try{
        let decoded = jwt.verify(token, CONFIG.JWT_KEY);
        let user = await Merchant.findOne({
            "_id": decoded._id,
            "tokens.token": token
        });

        req.body.user = user;
        
        if(!user){
            return res.status(401).json({
                type: CONFIG.ERROR,
                message: CONFIG.AUTH_ERR
            });
        }
    }catch(e){
        return res.status(401).json({
            type: CONFIG.ERROR,
            message: CONFIG.AUTH_ERR
        });
    }
    next();
}

module.exports = {authenticate};