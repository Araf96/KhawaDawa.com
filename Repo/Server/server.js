const express = require('express')
const cors = require('cors')
const axios = require('axios')
const bodyParser = require('body-parser')

const signup = require('./routes/merchant/signup')
const login = require('./routes/common/login')
const logout = require('./routes/common/logout')
const verify = require('./routes/common/verify')
const updateMerchant = require('./routes/merchant/updateMerchant')
const deactivate = require('./routes/common/deactivate')

const addFoodMenu = require('./routes/foodMenu/addFoodMenu');
const deleteFoodMenu = require('./routes/foodMenu/deleteFoodMenu');
const updateFoodMenu = require('./routes/foodMenu/updateFoodMenu');

var port = process.env.PORT || 3000;

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/_signup_merchant", signup);
app.use("/_verify", verify);
app.use("/_login_user", login);
app.use("/_update_merchant", updateMerchant);
app.use("/_logout_m", logout);
app.use("/_deactivate", deactivate);

app.use("/_addFoodMenu", addFoodMenu);
app.use("/_deleteFoodMenu", deleteFoodMenu);
app.use("/_updateFoodMenu", updateFoodMenu);

app.listen(port, ()=>{
    console.log(`Server started on port: ${port}`);
})

