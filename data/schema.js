const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        id: Int!
        username: String!
        email: String!

    }

    type Query {
        me : User
    }

    type Mutation {
        signin(username: String! , email: String!, password: String!) : User
        login(email: String!, password: String!) : User
        invalidateTokens: Boolean
    }
`

module.exports = typeDefs;