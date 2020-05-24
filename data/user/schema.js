const typeDefs = `
    type User {
        id: Int!
        username: String!
        email: String!
        nickname: String!
        familyName: String
        givenName: String
        picture: String
        createdAt: String
    }

    type GenereMeta {
        occurrence: Int!
        genere: Genere!
    }

    type UserProfile{
        user: User,
        description: String
        records: Int!
        recordsTime: Float!
        generes: [GenereMeta]
    }

    type Query {
        me : User
        profile(nickname: String!) : UserProfile
    }


    type Mutation {
        updateMe(input: updateMeInput): User
        
        updateMyNick(nickname: String):  Status!
        updateMyPicture(file: Upload!) : Status!
        udpateMyDescription(description: String): Status!
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