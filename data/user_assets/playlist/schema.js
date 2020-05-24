

const typeDefs = `

    type Dir {
        id: Int!
        root: Boolean!
        parrent: Dir
        name: String!
    }

    type Playlist {
        id: Int!
        dir: Dir!
        name: String!
    }

    type Track {
        id: Int!
        playlist: Playlist!
        title: String!
        source: String!
        sourceId: String!
        quality: String
        duration: Float!
        bpm: Float
        offset: Float
        thumbnails: JSON
        position: Int!
    }

    type Query {
        root : DirContent
        dir(id: Int!) : DirContent
        playlist(id: Int!) : PlaylistContent
        track(id: Int!): Track
    }

    type Mutation {
        createTrack(input: createTrackInput!): Track!
        updateTrack(id: Int! input: updateTrack): Boolean
        updateTracksPositions(input : [tracksPositions]!): Boolean
        deleteTrack(id: Int!): Boolean

        createDir(parrentId: Int! name:String!): Dir!
        renameDir(id: Int! name: String!): Boolean
        deleteDir(ids: [Int!]): Int

        createPlaylist(dirId: Int!, name: String!): Playlist!
        renamePlaylist(id: Int! name: String!): Boolean
        deletePlaylist(ids: [Int!]): Int
        
        moveDir(id: Int! targetId: Int!): Boolean
        movePlaylist(id: Int! targetId: Int!): Boolean
    }

    type DirContent {
        dir: Dir!
        dirs : [Dir]
        playlists : [Playlist]
    }

    type PlaylistContent {
        playlist: Playlist!
        tracks : [Track]!
    }

    input createTrackInput {
        playlist: Int!

        title: String!
        source: String!
        sourceId: String!
        quality: String
        duration: Float!
        bpm: Float
        offset: Float
        thumbnails: JSON
        position: Int!
    }

    input updateTrack {
        bpm: Float
        offset: Float 
        position: Int 
        playlist: Int
    }

    input tracksPositions{
        id: Int!
        position: Int!
    }
`

module.exports = typeDefs;