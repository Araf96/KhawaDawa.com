const express = require('express')
const router = express.Router()
const _ = require('lodash')


const {FoodMenu} = require('../../models/foodMenu')
const CONFIG = require('../../config')

const {authenticate} = require('../../middleware/authenticate')

router.use(authenticate);

router.delete('/', async (req, res) => {
    let result = {};

    try{
        let deletedMenu = await FoodMenu.findOneAndDelete({_id: req.query.id});

        if(deletedMenu){
            result.type = CONFIG.SUCCESS;
            result.message = CONFIG.DELETE_SUCCESS.replace('@menuname', deletedMenu.name);
        }else{
            throw new Error(CONFIG.DELETE_FAILED);
        }

        res.json(result);

    }catch(e){
        result.type = CONFIG.ERROR;
        if(e.message){
            result.message = e.message;
        }else{
            result.message = CONFIG.DELETE_FAILED;
        }
        res.status(400).json(result);
    }

});

module.exports = router;