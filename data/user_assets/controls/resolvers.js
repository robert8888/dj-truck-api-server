require("dotenv").config();

const { ControlProfile, ControlProfileItem, User} = require("./../../../models");

const resolvers = {

    Query: {
        async controlProfile(_, { id }){
            return ControlProfile.findOne({
                where: { id },
                include: [{
                    model: ControlProfileItem,
                    as: "map",
                }, {
                    model: User,
                    as: 'user',
                }]
            });
        },

        async controlProfileList(_, {userId}, { user }){
            if (!user) throw new Error("not authenticated");

            if(!userId){
                ({ id: userId } = await User.findOne({ where: { "authId": user.sub } }))
            }
            return ControlProfile.findAll({
                where: {userId},
            });
        }
    },


    Mutation: {
        async createControlProfile(_, {  name, type }, { user }) {
            if (!user) throw new Error("not authenticated");
            const { id: userId } = await User.findOne({ where: { "authId": user.sub } })

            let controlProfile = ControlProfile.create({
                name,
                type,
                userId
            })
            return controlProfile;
        },

        async updateControlProfile(_, { input }, { user }){
            let {id } = input;

            delete input.id;
            const update = await ControlProfile.update({...input}, {where: { id }, returning: true})
            if(update[0] !== 1) return null;
            let controlProfile = update[1][0];
            return controlProfile;
        },

        async updateControlProfileMap(_, {id, map}, {user}){
            console.log(map)
            await ControlProfileItem.destroy({where: { controlProfileId: id }});
            map = map.map( item => {
                item.controlProfileId = id
                return item;
            });

            const items = await ControlProfileItem.bulkCreate(map, {returning: true})

            return items.length === map.length;
        },

        async deleteControlProfile(_, { id }) {
            const result =  await ControlProfile.destroy({ where: { id } });
            return (result === 1);
        },
    }
}

module.exports = resolvers;