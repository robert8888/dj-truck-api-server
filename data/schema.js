const { gql } = require('apollo-server-express');
const { mergeTypes } = require('merge-graphql-schemas');

const types = [
    require("./common/schema"),
    require("./user/schema"),
    require("./user_assets/playlist/schema"),
    require("./user_assets/records/schema"),
    require("./user_assets/controls/schema"),
]

let typeDefs = mergeTypes(types);

typeDefs = gql`${typeDefs}`;

module.exports = typeDefs;