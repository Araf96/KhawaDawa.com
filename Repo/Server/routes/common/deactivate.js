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
        user.deactivationDate = new Date();
        user.isActive = false;

        let updatedUser = user.save();
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