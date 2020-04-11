require("dotenv").config();
const { User } = require("./../../models");

const userMap = user => {
    return {
        id,
        username,
        email,
        nickname, 
        familyName , 
        givenName, 
        picture
    } = user;
}

const resolvers = {
    Query: {
        async me(obj, args, {user}, opt) {
            if (!user) {
                throw new Error("not authenticated")
            }

            let _user = await User.findOne({where : {"authId": user.sub}});

            return userMap(_user);
        }
    },


    Mutation: {
        async updateMe(obj, args, {user}){
            if(!user){
                throw new Error("not authenticated");
            }

            let _user = await User.findOne({where : { id: user.sub}});

            Object.entries(args.input).forEach(([key, value]) => {
                _user[key] = value;
            })
            await _user.save();

            return userMap(_user);
        }

    }
}

module.exports = resolvers;