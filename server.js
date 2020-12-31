require('dotenv').config();

const express = require("express");
const cors = require("express-cors");
const cookieParser = require("cookie-parser");
const typeDefs = require("./data/schema");
const resolvers = require("./data/resolvers");
const jwt = require("express-jwt");
const jwksRsa = require('jwks-rsa')
const { ApolloServer } = require("apollo-server-express");
const { template: homeTemplate } = require("./homeTemplate");


const PORT = process.env.PORT || process.env.SERVER_PORT

const app = express();

app.use(cors());

app.use(cookieParser());

const jwtCheck = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.AUTH0_ISSUER + '.well-known/jwks.json'
    }),
    audience:  process.env.AUTH0_AUDIENCE,
    issuer: process.env.AUTH0_ISSUER,
    algorithms: ['RS256']
});

app.use((req, res, next)=>{
    handleErrr = err =>{
        // if(err){
        //     if(err.name === "UnauthorizedError")
        //     {
        //         console.log("unauthorized connection try");
        //         return next();
        //     }
        //
        // }
        next();
    }
    jwtCheck(req, res, handleErrr)
});

// app.use((req, res, next)=>{
//     req.user = {
//         sub : "facebook|4195047167187480"
//     }
//     next();
// })

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
        // if(!req.user){
        //     throw new AuthenticationError('to reach data in this api you have to be logged');
        // }
        //
        return { user: req.user, req, res}
    }
});

server.applyMiddleware({ app, path: "/api/v0/graphql" });

app.get("/", (req, res) =>{
    res.send(homeTemplate)
})

app.listen(PORT, () => {
    console.log("server stared on : "+PORT+"/api/v0/graphql")
})