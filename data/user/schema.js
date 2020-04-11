const typeDefs = `
    type User {
        id: Int!
        username: String!
        email: String!
        nickname: String!
        familyName: String
        givenName: String
        picture: String
    }

    type Query {
        me : User
    }

    type Mutation {
        updateMe ( input : updateMeInput!): User
    }

    input updateMeInput {
        id: Int!,
        username: String,
        email: String,
        nickname: String,
        familyName: String,
        givenName: String,
        picture: String,
    }
`

module.exports = typeDefs;