require("dotenv").config();
var request = require("request");
const axios = require("axios").default;
const clientSecret = process.env.AUTH0_CLIENT_SECRET
const clientId = process.env.AUTH0_CLIENT_ID
const issuer = process.env.AUTH0_ISSUER
const audience = process.env.AUTH0_AUDIENCE

const getAuthToken = async () => {

    const options = { 
        method: 'POST',
        url: issuer + 'oauth/token',
        headers: { 'content-type': 'application/json' },
        data: {
              "grant_type":"client_credentials",
              "client_id": clientId,
              "client_secret": clientSecret,
              'audience': audience
        }
    };
    const response = await axios.request(options)
    return response.data.access_token;
}

const updateUserData = async (userId, userData) => {
    const issuer = "https://dev-5dgw0l6j.eu.auth0.com/"
    try{
        const token = await getAuthToken();
        const options = {
            method: 'PATCH',
            url: issuer + 'api/v2/users/'+ userId,
            headers: {
                authorization: 'Bearer ' + token, 
                'content-type': 'application/json'
            },
            data: {
                ...userData
            },
            json: true
        };

        const response = await axios.request(options)
        return response.data;
    } catch (err){
        throw new Error("can't update user picture in auth0 database" + err)
    }

}

module.exports.getAuthToken = getAuthToken;
module.exports.updateUserData = updateUserData;