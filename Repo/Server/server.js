const express = require('express')
const _ = require('lodash')
const axios = require('axios')
const bodyParser = require('body-parser')

const mongoose =  require('./db/mongoose')
const {Merchant} = require('./models/merchant')
const CONFIG = require('./config')
const utils = require('./utils/utils')
const mailer = require('./utils/mailer')


var port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());

app.post('/createMerchant', async (req, res)=>{
    var merchant = new Merchant( _.pick(req.body,['firstName','lastName','email','password','companyName','mobile']));

    try{
        let result = await merchant.save();
        let token = await merchant.generateAuthToken();
        console.log(result);
        mailer.sendMail({
            type:"signup verification",
            vToken:result.vToken,email:result.email,
            firstName:result.firstName,
            lastName:result.lastName
        });

        res.header('x-auth',token).send(result)
    }catch(err){
        console.log(JSON.stringify(err,undefined,2));

        var result = {}

        if(err.name === "ValidationError"){
            var keys = Object.keys(err.errors);

            if(err.errors[keys[0]]){
                result.message = err.errors[keys[0]].message;
            }else{
                result.message = "Unknown ERROR"
            }
        }else if(err.code == 11000){
            var keys = Object.keys(err.keyValue);

            if(keys[0] === "companyName"){
                result.message = "Company with the given COMPANY NAME already exists";
            }else if(keys[0] === "email"){
                result.message = "User with the given EMAIL ADDRESS already exists";
            }else{
                result.message = "Duplicate key error"
            }
        }else{
            result.message = "Unknown ERROR"
        }
        
        res.status(400).send(result);

    }
});

app.get('/verify', async (req, res)=>{

    let tokenDate = parseInt(req.query.ts);
    let currDate = new Date().getTime();

    console.log(req.query);
    console.log(currDate);
    if(currDate - tokenDate > 1800000){
        res.status(400).send({type:CONFIG.ERROR,message: CONFIG.VER_EXPIRED_MESSAGE});
    }else{
        try{
            let condition = {
                isActive : {$ne:true}, 
                vToken: {$eq:req.query.vtk}
            }
            let update = {isActive:true};
            let option = {new : true};

            let result = await Merchant.findOneAndUpdate(condition,update,option);
            console.log(result);
            if(result){
                res.send({type:CONFIG.SUCCESS, message: CONFIG.VER_SUCCESS});
            }else{
                res.status(400).send({type:CONFIG.ERROR, message: CONFIG.VER_UNKNOWN});
            }            
        }catch(e){
            console.log(e);
            res.status(401).send({type:CONFIG.ERROR, message: CONFIG.VER_UNKNOWN});
        }
    }

});

app.listen(port, ()=>{
    console.log(`Server started on port: ${port}`);
})

