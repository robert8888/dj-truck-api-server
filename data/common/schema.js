const typeDefs = `
    scalar JSON

    type Status {
        success: Boolean!
        error: Boolean!
        message: String
        data: String
        errorDetails: String
    }
`

module.exports = typeDefs;