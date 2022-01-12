const express = require('express')
const router = express.Router()
const _ = require('lodash')

const CONFIG = require('../../config')
const {Merchant} = require('../../models/merchant')
const Utils = require('../../utils/utils')

router.post('/', async(req, res)=>{
    let body = _.pick(req.body, ['email','password']);
    let result = {}
    result.type = CONFIG.ERROR;
    try{
        let user = await Merchant.findOne({email:body.email});
        let status = 401;
        let token = null;

        if(user){
            if(user.isActive){
                
                let resPass = await Utils.matchHash(body.password, user.password);

                if(resPass){
                    try{
                        token = await user.generateAuthToken();
                        status = 200;
                    }catch(e){
                        result.message = e.message;
                    } 
                }else{
                    result.message = CONFIG.INV_PASS;
                }
            }else{
                result.message = CONFIG.ACTIVATE_USER;
            }
        }else{
            result.message = CONFIG.USER_N_EXIST;
        }

        if(status === 200){
            res.status(status).header('x-auth', token).send(user);
        }else{
            res.status(status).send(result);
        }
    }catch(e){
        result.message = CONFIG.ERR_UNKNOWN;
        res.status(400).send(result);
    }
});

module.exports = router;