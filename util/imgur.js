require('dotenv').config();
const request = require('request');
const {Writable} = require("stream");
const {Base64Encode} = require('base64-stream');
const url = process.env.IMGUR_URL;
const clientId = process.env.IMGUR_CLIENT_ID;
const secret = process.env.IMGUR_SECRET;

const streamToBase64 = (stream) => {
    return new Promise((res, rej) => {
        let str = "";
        stream.pipe(new Base64Encode()).on('data', (chunk)=>{
            str += chunk;
        }).on('end', ()=>{
            res(str)
        })
    })
}

module.exports.postImage = async function(imgStream, mimetype){
    const imgBase64 = await streamToBase64(imgStream);

    options = {
        'method': 'POST',
        'url': 'https://api.imgur.com/3/image',
        'headers': {
          'Authorization': `Client-ID ${clientId}`
        },
        formData: {
          'image': imgBase64
        }
    }
    
    req = new Promise((resolve, rej) => request(options, (err, res)=>{
        if(err) throw new Error(err);
        resolve(res.body);
    }));
    const data = await req;
    const json = JSON.parse(data);
    if(!json.success){
        throw new Error("uploding image fail" + data.error);
    }
    return json.data
}