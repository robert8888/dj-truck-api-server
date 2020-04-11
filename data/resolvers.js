const userResolvers = require("./user/resolvers");
const userAssetsResolvers =  require("./user_assets/resolvers");


let resolvers = [
    userResolvers,
    userAssetsResolvers
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