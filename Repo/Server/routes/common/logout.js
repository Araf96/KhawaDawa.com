const express = require('express')
const router = express.Router()

const CONFIG = require('../../config')
const {Merchant} = require('../../models/merchant')

const {authenticate} = require('../../middleware/authenticate')

router.use(authenticate);

router.get('/', async(req, res)=>{
    let error = {status:401,message:""};
    try{
        let tkn = req.header('x-auth');
        let query = {"tokens.token": tkn};
        let update = {$pull: {tokens:{token:tkn}}}
        let result = await Merchant.findOneAndUpdate(query,update);
        if(!result){
            throw new Error(CONFIG.LOGOUT_FAILED);
        }else{
            res.send({type:CONFIG.SUCCESS, message:CONFIG.LOGOUT_SUCCESS});
        }
    }catch(e){
        if(e.message){
            error.message = e.message;
        }else{
            error.message = CONFIG.ERR_UNKNOWN;
        }
        res.status(error.status).send(error);
    }
});

module.exports = router;
