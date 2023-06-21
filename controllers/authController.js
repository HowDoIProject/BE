const secret_key = require("../config/ncp_config");

const axios = require("axios");
const Cache = require("memory-cache");
const CryptoJS = require("crypto-js");

const date = Date.now().toString();
const uri = secret_key.NCP_serviceID;
const secretKey = secret_key.NCP_secretKey;
const accessKey = secret_key.NCP_accessKey;
const method = "POST";
const space = " ";
const newLine = "\n";
const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
const url2 = `/sms/v2/services/${uri}/messages`;

const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);

hmac.update(method);
hmac.update(space);
hmac.update(url2);
hmac.update(newLine);
hmac.update(date);
hmac.update(newLine);
hmac.update(accessKey);

const hash = hmac.finalize();
const signature = hash.toString(CryptoJS.enc.Base64);

exports.send = async function (req, res) {
    const user_number = req.body.user_number;
    const valid_time = 180000; //유효시간 3분

    Cache.del(user_number);

    //인증번호 생성
    const verify_code = Math.floor(Math.random() * (999999 - 100000)) + 100000;

    Cache.put(user_number, verify_code.toString(), valid_time);

    axios({
        method: method,
        json: true,
        url: url,
        headers: {
            "Content-Type": "application/json",
            "x-ncp-iam-access-key": accessKey,
            "x-ncp-apigw-timestamp": date,
            "x-ncp-apigw-signature-v2": signature,
        },
        data: {
            type: "SMS",
            contentType: "COMM",
            countryCode: "82",
            from: "01058778392",
            content: `[HOW DO I] 인증번호 [${verify_code}]를 입력해주세요.`,
            messages: [
                {
                    to: `${user_number}`,
                },
            ],
        },
    }).then(res.send(valid_time.toString()));
};

exports.verify = async function (req, res) {
    const user_number = req.body.user_number;
    const verify_code = req.body.verify_code;

    const CacheData = Cache.get(user_number);
    
    if (!CacheData) {
        return res.status(500).send({ message: "인증 시간이 만료되었습니다." });
    } else if (CacheData !== verify_code) {
        console.log("not verified");
        return res.status(500).send({ message: "인증에 실패하였습니다." });
    } else {
        Cache.del(user_number);
        res.cookie("verification", `${user_number}`);
        return res.status(200).send(true);
    }
};
