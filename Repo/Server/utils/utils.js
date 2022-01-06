const bcrypt = require('bcryptjs')

const getHashedValue = async (str) => {
    var hashed = null;
    return bcrypt.hash(str,10);
}

module.exports = {getHashedValue};