const userResolvers = require("./user/resolvers");
const userAssetsPlaylistResolvers =  require("./user_assets/playlist/resolvers");
const userAssetsRecordsResolvers = require("./user_assets/records/resolvers");

let resolvers = [
    userResolvers,
    userAssetsPlaylistResolvers,
    userAssetsRecordsResolvers
]

let resolversObject = {
    Query:{},
    Mutation:{}
};

for(let resolver of resolvers){
    resolversObject.Query = {
        ...resolversObject.Query,
        ...resolver.Query,
    }
    resolversObject.Mutation = {
        ...resolversObject.Mutation,
        ...resolver.Mutation,
    }
}

module.exports = resolvers;