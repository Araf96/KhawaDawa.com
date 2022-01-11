const express = require('express')
const router = express.Router()

const CONFIG = require('../config')
const {Merchant} = require('../models/merchant')

const {authenticate} = require('../middleware/authenticate')

router.use(authenticate);

router.put('/', async(req, res)=>{
    console.log("Inside private route");
    res.json(req.body.user);
});

module.exports = router;