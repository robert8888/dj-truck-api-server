module.exports.template = `
    <!doctype html>
    <html lang="en">
    <head>
    <style>
        * {
            margin:0;
            padding:0;
        }
        html, body{
            height: 100%;
        }
        div {
            display:flex; 
            justify-content:center; 
            align-content:center; 
            flex-direction:column; 
            text-align: center;
            width:100%; 
            height:100%
        }
    </style>
    </head>
    <body >
        <div style="">
            <h1> This is graphQl user assets api for project Dj truck. </h1> </br>
            <h3> All routes are protected by auth0 token. To get more info contact <a href="mail:robert.kami88@gmail.com">robert.kami88@gmail.com</a> </h3> 
        </div>
    </body>
`