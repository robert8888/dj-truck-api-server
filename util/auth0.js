require("dotenv").config();
var request = require("request");

const clientSecret = process.env.AUTH0_CLIENT_SECRET
const clientId = process.env.AUTH0_CLIENT_ID
const issuer = process.env.AUTH0_ISSUER
const audience = process.env.AUTH0_AUDIENCE

const getAuthToken = async () => {
    const options = { 
        method: 'POST',
        url: issuer + 'oauth/token',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            "client_id": clientId,
            "client_secret": clientSecret,
            "audience": issuer + "api/v2/",
            "grant_type":"client_credentials"
        })
    };

    const req = new Promise((resolve, rej) => request(options, function (error, response, body) {
        if (error) throw new Error(error);
        resolve(body);
        }));
    const body = await req;
    const json = JSON.parse(body)
    return json.access_token;
}

const updateUserData = async (userId, userData) => {
    try{
        const token = await getAuthToken();
        var options = {
            method: 'PATCH',
            url: issuer + 'api/v2/users/'+ userId,
            headers: {
                authorization: 'Bearer ' + token, 
                'content-type': 'application/json'
            },
            body: {
                ...userData
            },
            json: true
        };
       // console.log(options)
        const req = new Promise((resolve, rej) => 
            request(options, (error, _, body) =>{
                if(error) {
                    rej(error);
                }
                resolve(body);
        }))
        const body = await req;
    //    console.log(body);
        return body;
    } catch (err){
        throw new Error("can't update user picture in auth0 database" + err)
    }

}

module.exports.getAuthToken = getAuthToken;
module.exports.updateUserData = updateUserData;