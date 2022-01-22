const express = require('express')
const router = express.Router()
const _ = require('lodash')

const {FoodMenu} = require('../../models/foodMenu')
const CONFIG = require('../../config')

const {authenticate} = require('../../middleware/authenticate')

router.use(authenticate);

router.post('/', async(req, res) => {
    let body = _.pick(req.body, ['name', 'price', 'currency', 'tag']);
    let id = req.query.id;
    let error = {type: CONFIG.ERROR}
    try{
        let updatedMenu = await FoodMenu.findOneAndUpdate({_id: id}, body, {new: true});
        if(updatedMenu){
            res.json(updatedMenu);
        }else{
            throw new Error(CONFIG.UPDATE_FAILED);
        }
    }catch(e){
        if(e.message){
            error.message = e.message;
        }else{
            error.message = CONFIG.ERR_UNKNOWN;
        }
        res.status(400).json(error)
    }

});

module.exports = router;