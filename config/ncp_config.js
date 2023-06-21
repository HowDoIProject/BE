require('dotenv').config();
const env = process.env;

module.exports = {
    NCP_serviceID: env.NCP_SERVICE_ID,
    NCP_accessKey: env.NCP_ACCESSKEY,
    NCP_secretKey: env.NCP_SECRETKEY,
};