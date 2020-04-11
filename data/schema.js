const { gql } = require('apollo-server-express');
const { mergeTypes } = require('merge-graphql-schemas');

const types = [
    require("./user/schema"),
    require("./user_assets/schema")
]

let typeDefs = mergeTypes(types);

typeDefs = gql`${typeDefs}`;

module.exports = typeDefs;