const express = require('express')
const router = express.Router()
const _ = require('lodash')

const CONFIG = require('../../config')
const {Merchant} = require('../../models/merchant')

const {authenticate} = require('../../middleware/authenticate')
const { result } = require('lodash')

router.use(authenticate);

router.put('/', async(req, res)=>{
    let body = _.pick(req.body,['firstName','lastName','companyName','mobile','country','age']);

    let conditions = {"tokens.token": req.header('x-auth')};
    let update = {};

    for(i in body){
        update[i] = body[i];
    }

    let options = {new: true};
    
    try{
        let updatedUser = await Merchant.findOneAndUpdate(conditions, update, options);
        res.json(updatedUser);
    }catch(e){
        let error = {type: CONFIG.ERROR}
        if(e.message){
            error.message= e.message;
        }else{
            error.message = CONFIG.ERR_UNKNOWN;
        }
        res.status(400).send(result);
    }
});

module.exports = router;