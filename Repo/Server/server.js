const express = require('express')
const cors = require('cors')
const axios = require('axios')
const bodyParser = require('body-parser')

const signup = require('./routes/signup')
const login = require('./routes/login')
const logout = require('./routes/logout')
const verify = require('./routes/verify')
const updateMerchant = require('./routes/updateMerchant')

var port = process.env.PORT || 3000;

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/_signup_merchant", signup);
app.use("/_verify", verify);
app.use("/_login_user", login);
app.use("/_update_merchant", updateMerchant);
app.use("/_logout_m", logout);

app.listen(port, ()=>{
    console.log(`Server started on port: ${port}`);
})

