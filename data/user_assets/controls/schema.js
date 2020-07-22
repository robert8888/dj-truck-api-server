

const typeDefs = `
    type ControlProfileItem{
        key: String!
        value: String!
    }

    type ControlProfile {
        user: User 
        id: Int!
        name: String!
        type: String!
        map: [ControlProfileItem]
    }

    type Query {
        controlProfileList(userId: Int) : [ControlProfile]!
        controlProfile(id: Int) : ControlProfile!
    }

    type Mutation {
        createControlProfile(name: String!, type: String!) : ControlProfile!
        updateControlProfile(input: updateProfileInput): ControlProfile!
        updateControlProfileMap(id: Int!, map:[ControlProfileInput]): Boolean
        deleteControlProfile(id: Int!): Boolean
    }

    input ControlProfileInput{
        key: String!
        value: String!
    }

    input updateProfileInput{
        id: Int!
        name: String
        type: String
    }
`

module.exports = typeDefs;