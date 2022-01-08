const bcrypt = require('bcryptjs')

const getHashedValue = async (str) => {
    return bcrypt.hash(str,10);
}

const matchHash = async (str, hashed) => {
    return bcrypt.compare(str, hashed);
}



module.exports = {
    getHashedValue,
    matchHash
};