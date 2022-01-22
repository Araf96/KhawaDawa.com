const bcrypt = require('bcryptjs')

const getHashedValue = async (param) => {
    return bcrypt.hash(param,10);
}

const matchHash = async (str, hashed) => {
    return bcrypt.compare(str, hashed);
}

module.exports = {
    getHashedValue,
    matchHash
};