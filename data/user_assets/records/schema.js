

const typeDefs = `
scalar JSON
type Genre {
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
    genres: [Genre]
    
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

enum RecordsOrder{
    title,
    user,
    data,
}

type Query {
    records(input: getRecordsInput): Records!
    record(id: Int!) : Record

    genres(limit: Int): [Genre]
    genresLike(query: String!): [Genre]
}

type Mutation {
    createRecord(title: String!): Record
    updateRecord(id: Int! input: updateRecord): Boolean!
    deleteRecord(id: Int!) : Boolean!

    addGenre(name : String): Int!

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
    genres: [String]
    peaks: [Float]
    fileSize: String
    tracks: [recordTracksInput]
}

input recordTracksInput {
    start: Float
    end: Float
    id: Int
}

input recordsOrderInput {
    column: String
    type: String
}

input getRecordsInput {
    userId: Int
    nickname: String
    id: Int
    genreNames: [String]
    title: String
    query: String
    queryOpt: [String]
    pagin : paginationInput
    orderBy: recordsOrderInput
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