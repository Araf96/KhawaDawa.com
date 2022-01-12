const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const {Merchant} = require('../models/merchant')
const CONFIG = require('../config')
const Utils = require('../utils/utils')


const passVerification_v1 = async(req, res, next) => {

};

const passVerification_v2 = async(req, res, next) => {
    let user = req.body.user;
    let pass = req.body.password;
    let error = {type: CONFIG.ERROR}
    try{
        let result = await Utils.matchHash(pass, user.password);
        console.log("resutl");
        if(!result){
            error.message = CONFIG.INV_PASS;
            return res.status(401).send(error)
        }
    }catch(e){
        if(e.message){
            error.message = e.message;
        }else{
            error.message = CONFIG.ERR_UNKNOWN;            
        }    
        return res.status(400).send(error)      
    }  
    next();
};

module.exports = {passVerification_v1, passVerification_v2};