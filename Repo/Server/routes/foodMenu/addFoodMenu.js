const express = require('express');
const router = express.Router();
const _ = require('lodash');

const {FoodMenu} = require('../../models/foodMenu');
const CONFIG = require('../../config')

const {authenticate} = require('../../middleware/authenticate');

router.use(authenticate);

router.post('/', async (req, res)=>{
    let data = _.pick(req.body, ['name','itemList','price','tag']);
    data.createdAt = new Date();
    data.merchantID = req.body.user._id;
    data.companyName = req.body.user.companyName;
    data.createdBy = req.body.user.firstName + " " + req.body.user.lastName;

    let addFoodMenu = new FoodMenu(data);

    try{
        let saveMenu = await addFoodMenu.save();
        if(saveMenu){
            res.json(saveMenu);
        }else{
            throw new Error(CONFIG.INSERT_FAILED);
        }
        
    }catch(e){
        let error = {type: CONFIG.ERROR}
        if(e.message){
            error.message = e.message;
        }else{
            error.message = CONFIG.ERR_UNKNOWN;
        }
        res.status(400).json(error)
    }

});

module.exports = router;