require("dotenv").config();
const { User } = require("./../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { createAndAssignTokens } = require("./../auth");

console.log(User)

const resolvers = {
    Query: {
        async me(obj, args, {req, res}, opt) {
            if (!req.userId) {
                throw new Error("not authenticated")
            }

            let user = await User.findOne({where : {id: req.userId}});

            return {
                id: user.id,
                username: user.username,
                email: user.email,
            }
        }
    },

    Mutation: {
        async signin( _, {username, email, password}, {req, res}) {
            const user = await User.create({
                username,
                email,
                password: await bcrypt.hash(password, 10)
            })


            createAndAssignTokens(user, res)

            return {
                id: user.id, 
                username: user.username,
                email: user.email,
            };
        },

        async login(_ , {email, password}, {req, res}) {
            const user = await User.findOne({ where: { email } });


            if (!user) {
                throw new Error("user with that email doesn't exist")
            }

            const valid = bcrypt.compare(user.password, password);

            if (!valid) {
                throw new Error("Incorrect password");
            }

            createAndAssignTokens(user, res)

            return {
                id: user.id, 
                username: user.username,
                email: user.email,
            };
        },

        async invalidateTokens( _, __ , {req , res}){
            if(!req.userId){
                return false;
            }
            const user = await User.findOne({where : { id : req.userId}})
            user.count += 1;
            await user.save();

            res.clearCookies("refresh-token");
            res.clearCookies("access-token") 
            return true;
        } 
    }
}

module.exports = resolvers;