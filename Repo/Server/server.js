const express = require('express')
const _ = require('lodash')
const axios = require('axios')
const bodyParser = require('body-parser')

const mongoose =  require('./db/mongoose')
const {Merchant} = require('./models/merchant')
const CONFIG = require('./config')
const utils = require('./utils/utils')
const mailer = require('./utils/mailer')
const {authenticate} = require('./middleware/authenticate')
const { result } = require('lodash')


var port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());

app.post('/_signup_merchant', async (req, res)=>{
    var merchant = new Merchant( _.pick(req.body,['firstName','lastName','email','password','companyName','mobile']));

    try{
        let result = await merchant.save();

        mailer.sendMail({
            type:"signup verification",
            vToken:result.vToken,email:result.email,
            firstName:result.firstName,
            lastName:result.lastName
        });

        res.send(result)
    }catch(err){
        console.log(JSON.stringify(err,undefined,2));

        var result = {}

        if(err.name === "ValidationError"){
            var keys = Object.keys(err.errors);

            if(err.errors[keys[0]]){
                result.message = err.errors[keys[0]].message;
            }else{
                result.message = CONFIG.ERR_UNKNOWN;
            }
        }else if(err.code == 11000){
            var keys = Object.keys(err.keyValue);

            if(keys[0] === "companyName"){
                result.message = CONFIG.COMPANY_EXISTS;
            }else if(keys[0] === "email"){
                result.message = CONFIG.EMAIL_EXISTS;
            }else{
                result.message = CONFIG.DUP_KEY;
            }
        }else{
            result.message = CONFIG.ERR_UNKNOWN;
        }
        
        res.status(400).send(result);

    }
});

app.get('/verify', async (req, res)=>{

    let tokenDate = parseInt(req.query.ts);
    let currDate = new Date().getTime();

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

app.post('/_login_user', async(req, res)=>{
    let body = _.pick(req.body, ['email','password']);
    let result = {}
    result.type = CONFIG.ERROR;
    try{
        let user = await Merchant.findOne({email:body.email});
        let status = 401;
        let token = null;

        if(user){
            if(user.isActive){
                
                let resPass = await utils.matchHash(body.password, user.password);

                if(resPass){
                    try{
                        token = await user.generateAuthToken();
                        status = 200;
                    }catch(e){
                        result.message = e.message;
                    } 
                }else{
                    result.message = CONFIG.INV_PASS;
                }
            }else{
                result.message = CONFIG.ACTIVATE_USER;
            }
        }else{
            result.message = CONFIG.USER_N_EXIST;
        }

        if(status === 200){
            res.status(status).header('x-auth', token).send(user);
        }else{
            res.status(status).send(result);
        }
    }catch(e){
        result.message = CONFIG.ERR_UNKNOWN;
        res.status(400).send(result);
    }

});

app.post('/_update_merchant_', authenticate, async(req, res)=>{
    console.log("Inside private route");
    res.json(req.body.user);
});

app.get('/_logout_m_', async(req, res)=>{
    let error = {status:401,message:""};
    try{
        let tkn = req.header('x-auth');
        let query = {"tokens.token": tkn};
        let update = {$pull: {tokens:{token:tkn}}}
        let result = await Merchant.findOneAndUpdate(query,update);
        if(!result){
            throw new Error(CONFIG.LOGOUT_FAILED);
        }else{
            res.send(result);
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


app.listen(port, ()=>{
    console.log(`Server started on port: ${port}`);
})

