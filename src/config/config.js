var CryptoJS = require("crypto-js");
var dataEncryptionKey = 'mAeUgGaKaDdDaKuGEnC123';
module.exports = {
    ENV: {
        url: process.env.REACT_APP_BASE_URL,
        // privateKeys: process.env.PRIVATE_KEY,
        privateKeys:"01x23y45z",
        // Headers
        Authorization: `Bearer ${process.env.REACT_APP_AUTHORIZATION}`,
        x_auth_token: process.env.REACT_APP_X_AUTH_TOKEN,

        Backend_Img_Url: process.env.REACT_APP_BACKEND_IMG_URL,

        //set user in local storage
        encryptUserData: function (data) {
            data = JSON.stringify(data);
            var encryptedUser = CryptoJS.AES.encrypt(data, dataEncryptionKey).toString();
            localStorage.setItem('encuse', encryptedUser);
            return true;
        },

        //return required keys
        getUserKeys: function (keys = null) {
            let userData = localStorage.getItem('encuse');
            if (userData) {
                var bytes = CryptoJS.AES.decrypt(userData, dataEncryptionKey);
                var originalData = bytes.toString(CryptoJS.enc.Utf8);
                originalData = JSON.parse(originalData);
                let user = {};
                if (keys) {
                    keys = keys.split(" ");
                    for (let key in keys) {
                        let keyV = keys[key];
                        user[keyV] = originalData[keyV];
                    }
                }
                else {
                    user = originalData;
                }
                return user;
            } else {
                return {};
            }

        },
        //clear everything from localstorage
        clearStorage: function () {
            localStorage.removeItem('encuse');
            localStorage.removeItem('aut');
        },

        objectToQueryString: function (body) {
            const qs = Object.keys(body).map(key => `${key}=${body[key]}`).join('&');
            return qs;
        }
    }
}