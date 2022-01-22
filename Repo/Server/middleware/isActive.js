const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const CONFIG = require('../config')

const isActive = (req, res, next) => {
    let user = req.body.user;

    if(!user.isActive){
        return res.send({
            type: CONFIG.ERROR,
            message: CONFIG.ACTIVATE_USER
        });
    }
    next();
}

module.export = {isActive}