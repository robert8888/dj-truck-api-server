require('dotenv').config();

const express = require("express");
const cookieParser = require("cookie-parser");
const typeDefs = require("./data/schema");
const resolvers = require("./data/resolvers");
const { ApolloServer } = require("apollo-server-express");
const { verify } = require("jsonwebtoken");
const { User } = require("./models");
const { createAndAssignTokens } = require("./auth");

const PORT = process.env.SERVER_PORT

const app = express();

app.use(cookieParser());

app.use((req, res, next) => {
    const refreshToken = req.cookies["refresh-token"];
    const accessToken = req.cookies["access-token"];

    if (!refreshToken && !accessToken) {
        return next();
    }

    try {
        const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.userId = data.id;
        return next();
    } catch { }

    if (!refreshToken) {
        return next();
    }

    let data;
    try {
        data = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch {}

    if(!data) { return next() }

    const { id, count } = data;
    let user = User.findOne({ where: { id } })

    if (!user || user.count !== count) {
        return next();
    }

    createAndAssignTokens(user, res)
    req.userId = user.id;

    next();
})

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res })
});

server.applyMiddleware({ app, path: "/api/graphql" });

app.listen(PORT, () => {
    console.log("server stared on : /api:" + process.env.SERVER_PORT)
})