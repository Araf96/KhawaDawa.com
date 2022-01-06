const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const {mongoose} = require('./../db/mongoose');
const utils = require('../utils/utils');

const merchantSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: [true, "Field FIRST NAME is required"],
        minLength:[3, "Given FIRST NAME is shorter than minimum length (3)"],
        maxLength:[15, "Given FIRST NAME is greater than maximum length (15)"]
    },
    lastName:{
        type: String,
        required: [true, "Field LAST NAME is required"],
        minLength:[3, "Given SECOND NAME is shorter than minimum length (3)"],
        maxLength:[15, "Given SECOND NAME is greater than maximum length (15)"]
    },
    companyName:{
        type: String,
        unique: [true,"COMPANY already exists with this name"],
        required: [true, "Field COMPANY NAME is required"],
        minLength:[3, "Given COMPANY NAME is shorter than minimum length (3)"],
        maxLength:[50, "Given COMPANY NAME is greater than maximum length (50)"]
    },
    email:{
        type:String,
        unique: [true,"This EMAIL ADDRESS is already registered"],
        required:[true, "Field EMAIL is required"],
        validate: [validator.isEmail, "INVALID EMAIL"]
    },
    mobile:{
        type:String,
        required:[true, "Field MOBILE is required"],
        valiadte: [validator.isMobilePhoneLocales, "INVALID MOBILE NUMBER"]
    },
    password:{
        type:String,
        minLength:[6,'Given PASSWORD is shorter than minimum length (6)'],
        required:true
    },
    phone:{
        type:String
    },
    country:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:false
    },
    vToken:{
        type:String
    },
    tokens:[
        {
            access:{
                type:String,
                required:true
            },
            token:{
                type:String,
                required:true
            }
        }
    ]
});

merchantSchema.pre('save', async function(next){
    var user = this;

    if(user.isModified('password')){
        let tempPass = await utils.getHashedValue(user.password);
        if(tempPass){
            user.password  = tempPass;
        }
    }

    if(user.isModified('email')){
        let verificationToken = await utils.getHashedValue(user.email);
        if(verificationToken){
            user.vToken  = verificationToken;
            user.isActive = false;
        }
    }

    next();
});


merchantSchema.methods.toJSON = function(){
    var user = this;
    return _.pick(user,['firstName','lastName','companyName','email','mobile']);
}


merchantSchema.methods.generateAuthToken = async function(){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id},'khawaDawa');

    user.tokens.push({access,token});

    try{
        var result = await user.save();
        return token;
    }catch(e){
        throw new Error('Failed to generate token');
    }
    
}



const Merchant = mongoose.model('Merchant',merchantSchema);

module.exports = {Merchant}