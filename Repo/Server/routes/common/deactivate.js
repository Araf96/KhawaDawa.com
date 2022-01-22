const express = require('express')
const router = express.Router()
const _ = require('lodash')

const CONFIG = require('../../config')
const {Merchant} = require('../../models/merchant')

const {authenticate} = require('../../middleware/authenticate')
const {passVerification_v2} = require('../../middleware/passVerification')
const { result } = require('lodash')

router.use(authenticate);
router.use(passVerification_v2);

router.post('/', async(req, res)=>{
    let user = req.body.user;
    let error = {type: CONFIG.ERROR}

    try{
        let tkn = req.header('x-auth');
        let query = {"tokens.token": tkn};
        let update = {  
            $pull: {tokens:{token:tkn}},
            $set: {
                deactivationDate: new Date(),
                isActive: false
            }
        }

        let updatedUser = await Merchant.findOneAndUpdate(query, update);

        res.json(updatedUser);
    }catch(e){
        if(e.message){
            error.message = e.message;
        }else{
            error.message = CONFIG.ERR_UNKNOWN;
        }
        res.status(400).json(error);
    }
    
});

module.exports = router;