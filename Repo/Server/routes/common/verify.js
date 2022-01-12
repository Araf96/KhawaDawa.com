const express = require('express')
const router = express.Router()

const CONFIG = require('../../config')
const {Merchant} = require('../../models/merchant')

router.get('/', async (req, res)=>{
    let tokenDate = parseInt(req.query.ts);
    let currDate = new Date().getTime();

    if(currDate - tokenDate > CONFIG.TOKEN_EXPIRE_TIME){
        res.status(400).send({type:CONFIG.ERROR,message: CONFIG.VER_EXPIRED_MESSAGE});
    }else{
        try{
            let condition = {
                isActive : {$ne:true}, 
                vToken: {$eq:req.query.vtk}
            }
            let update = {isActive:true, activationDate: new Date()};
            let option = {new : true};

            let result = await Merchant.findOneAndUpdate(condition,update,option);

            if(result){
                res.send({type:CONFIG.SUCCESS, message: CONFIG.VER_SUCCESS});
            }else{
                res.status(400).send({type:CONFIG.ERROR, message: CONFIG.VER_UNKNOWN});
            }            
        }catch(e){
            res.status(401).send({type:CONFIG.ERROR, message: CONFIG.VER_UNKNOWN});
        }
    }
});

module.exports = router;