const express = require('express')
const router = express.Router()
const _ = require('lodash')

const CONFIG = require('../../config')
const {Merchant} = require('../../models/merchant')

const {authenticate} = require('../../middleware/authenticate')
const { result } = require('lodash')

router.use(authenticate);

router.post('/', async(req, res)=>{
    let error = {type: CONFIG.ERROR}
    if(req.body.user.isActive){
        let body = _.pick(req.body,['firstName','lastName','companyName','mobile','country','age']);

        let conditions = {
            "tokens.token": req.header('x-auth')
        };
        let update = {};
    
        for(i in body){
            update[i] = body[i];
        }
    
        let options = {new: true};
        
        try{
            let updatedUser = await Merchant.findOneAndUpdate(conditions, update, options);
            res.json(updatedUser);
        }catch(e){
            
            if(e.message){
                error.message= e.message;
            }else{
                error.message = CONFIG.ERR_UNKNOWN;
            }
            res.status(400).send(error);
        }
    }else{
        error.message = CONFIG.ACTIVATE_USER;
    }  
});

module.exports = router;