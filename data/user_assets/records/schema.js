

const typeDefs = `
scalar JSON
type Genere {
    id: Int!
    name: String!
}

type tracklistItem{
    start: Float
    end: Float
    track: Track
}

type Record {
    id: Int!
    user: User!
    title: String!
    generes: [Genere]
    
    comments: [Comment]
    tracks: [tracklistItem]
    description: String

    """createAt column in database"""
    createdAt: String!

    """ array of meter peaks """
    peaks: [Float]

    """in seconds"""
    duration: Float
    fileSize: String

    """is the current user favorite track"""
    favorited: Boolean
}

type Records {
    records : [Record]!
    countAll : Int!
}

type Comment {
    id: Int!
    user: User!
    record: Record!
    time: Float!
    text: String
    createdAt: String
}

type Query {
    records(input: getRecordsInput): Records!
    record(id: Int!) : Record

    generes: [Genere]
    generesLike(query: String!): [Genere]
}

type Mutation {
    createRecord(title: String!): Record
    updateRecord(id: Int! input: updateRecord): Boolean!
    deleteRecord(id: Int!) : Boolean!

    addGenere(name : String): Int!

    createComment(input: createComment): Comment!
    updateComment(input: updateComment): Boolean!
    deleteComment(id: Int!): Boolean!

    addToFavorite(recordId: Int!): Boolean!
    removeFavorite(recordId: Int!): Boolean!
}

input updateRecord {
    title: String
    duration: Float
    description : String
    generes: [String]
    peaks: [Float]
    fileSize: String
    tracks: [recordTracks]
}

input recordTracks {
    id: Int!
    start: Float!
    end: Float!
}

input getRecordsInput {
    userId: Int
    nickname: String
    id: Int
    genereNames: [String]
    title: String
    query: String
    queryOpt: [String]
    pagin : paginationInput
}

input createComment {
    userId: Int!
    recordId: Int!
    text: String!
    time: Float!
}

input updateComment{
    commentId: Int!
    text: String!
}

input paginationInput {
    page: Int!
    pageSize: Int!
}


`

module.exports = typeDefs;