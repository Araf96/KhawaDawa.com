const express = require('express');
const router = express.Router();
const _ = require('lodash');

const CONFIG = require('../../config');
const {Merchant} = require('../../models/merchant');
const Mailer = require('../../utils/mailer');


router.post('/', async (req, res)=>{
    var merchant = new Merchant( _.pick(req.body,['firstName','lastName','email','password','companyName','mobile']));
    merchant.signupDate = new Date();
    
    try{
        let result = await merchant.save();

        Mailer.sendMail({
            type:"signup verification",
            vToken:result.vToken,email:result.email,
            firstName:result.firstName,
            lastName:result.lastName
        });

        res.send(result)
    }catch(err){
        var result = {}

        if(err.name === "ValidationError"){
            var keys = Object.keys(err.errors);

            if(err.errors[keys[0]]){
                result.message = err.errors[keys[0]].message;
            }else{
                result.message = CONFIG.ERR_UNKNOWN;
            }
        }else if(err.code == 11000){
            var keys = Object.keys(err.keyValue);

            if(keys[0] === "companyName"){
                result.message = CONFIG.COMPANY_EXISTS;
            }else if(keys[0] === "email"){
                result.message = CONFIG.EMAIL_EXISTS;
            }else{
                result.message = CONFIG.DUP_KEY;
            }
        }else{
            result.message = CONFIG.ERR_UNKNOWN;
        }
        
        res.status(400).send(result);

    }
});

module.exports = router;