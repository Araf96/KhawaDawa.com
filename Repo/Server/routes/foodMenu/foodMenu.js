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

router.patch('/', async(req, res) => {
    let body = _.pick(req.body, ["_id",'name', 'price', 'currency', 'tag']);
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


//////////////////////////////////////// ITEM ROUTES //////////////////////////////////////


router.post('/addItem', async(req, res)=>{
    let id = req.query.id;

    let item = req.body.item;

    try{

        let savedItem = await FoodMenu.findOneAndUpdate({_id: id}, {$addToSet : {itemList: item}}, {new : true});

        if(savedItem){
            res.json(savedItem);
        }else{
            throw new Error(CONFIG.ITEM_ADD_FAILED);
        }

    }catch(e){

        let error = {type: CONFIG.ERROR}
        error.message = CONFIG.ITEM_ADD_FAILED;
        
        res.status(400).json(error);

    }

});

router.patch('/updateItem', async(req, res)=>{
    let id = req.query.id;

    try{

        let conditions = {_id: id, itemList: req.body.oldItem};
        let update = {$set : {"itemList.$": req.body.newItem}};
        let options = {new: true};
        console.log(req.body.oldItem);
        let savedItem = await FoodMenu.findOneAndUpdate(conditions, update, options);

        if(savedItem){
            res.json(savedItem);
        }else{
            throw new Error(CONFIG.ITEM_UPDATE_FAILED);
        }

    }catch(e){

        let error = {type: CONFIG.ERROR}
        error.message = CONFIG.ITEM_UPDATE_FAILED;
        
        res.status(400).json(error);

    }

});

router.delete('/deleteItem', async(req, res)=>{
    let id = req.query.id;

    let item = req.body.item;

    try{

        let savedItem = await FoodMenu.findOneAndUpdate({_id: id}, {$pull : {itemList: item}}, {new : true});

        if(savedItem){
            res.json(savedItem);
        }else{
            throw new Error(CONFIG.ITEM_DELETE_FAILED);
        }

    }catch(e){

        let error = {type: CONFIG.ERROR}
        error.message = CONFIG.ITEM_DELETE_FAILED;
        
        res.status(400).json(error);

    }

});

module.exports = router;