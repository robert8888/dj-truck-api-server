require("dotenv").config();
const { postImage } = require("./../../util/imgur");
const { updateUserData } = require("./../../util/auth0");

const {
    User,
    UserMeta,
    Record,
    Genre,
    RecordGenres,
    Sequelize } = require("./../../models");
const { Status } = require("./../../models/status");

const userMap = user => {
    return {
        id,
        username,
        email,
        nickname,
        familyName,
        givenName,
        picture
    } = user;
}


const resolvers = {
    Query: {
        async me(obj, args, { user }, opt) {
            try{
                if (!user) {
                    throw new Error("not authenticated")
                }
                let _user = await User.findOne({ where: { authId: user.sub } });

                return userMap(_user);
            } catch (error){
                console.log(error);
            }

        },

        async profile(_, { nickname }, opt) {
            let result = {};
            result.user = await User.findOne({
                where: { nickname },
                attributes: {
                    include: ['createdAt']
                }
            });

            const meta = await UserMeta.findOrCreate({
                where: { userId: result.user.id },
                defaults: { userId: result.user.id, description: "" }
            })
            result.description = meta[0].dataValues.description

            const records = await Record.findAndCountAll({
                where: { userId: result.user.id }
            })
            result.records = records.count || 0;

            const recordsDuration = await Record.findAll({
                where: { userId: result.user.id },
                attributes: [
                    [Sequelize.fn('sum', Sequelize.col('duration')), 'total_duration']
                ]
            })
            result.recordsTime = recordsDuration[0].dataValues.total_duration || 0;

            const recordIds = records.rows.map(record => record.id);

            const genres = await Genre.findAll({
                include: [
                    {
                        model: Record,
                        right: true,
                        attributes: ['id'],
                        through: {
                            model: RecordGenres,
                            where: {
                                recId: recordIds
                            }
                        },

                    }
                ],
            })

            result.genres = genres.map(genre => ({
                genre,
                occurrence: genre.dataValues.Records.length,
            }));

            console.log(result)
            return result;
        }


    },


    Mutation: {
        async createUser(_, { input }, { user }) {
            try {
                if (!user) {
                    throw new Error("not authenticated");
                }

                const {
                    username,
                    email,
                    nickname,
                    givenName,
                    familyName,
                    picture
                } = input;

                const newUser = await User.create({
                    authId: user.sub,
                    username,
                    email,
                    nickname,
                    givenName,
                    familyName,
                    picture
                });

                return new Status(true, "User created", { user: newUser });
            } catch (error) {
                console.error(error);
                return new Status(false, "Failed to create user", error.message);
            }
        },

        async updateMe(obj, args, { user }) {
            if (!user) {
                throw new Error("not authenticated");
            }

            let _user = await User.findOne({ where: { authId: user.sub } });

            Object.entries(args.input).forEach(([key, value]) => {
                _user[key] = value;
            })
            await _user.save();

            return userMap(_user);
        },

        async updateMyPicture(obj, { file }, { user }) {
            try {

                if (!user) {
                    throw new Error("not authenticated");
                }

                const { stream, filename, mimetype, encoding } = await file;
                const imgData = await postImage(stream, mimetype);
                const imgUrl = imgData.link;
                const _user = await updateUserData(user.sub, {
                    picture: imgUrl,
                    user_metadata: {
                        picture: imgUrl,
                        picture_large: imgUrl
                    },
                });
                let affected = await User.update({ picture: imgUrl }, { where: { authId: user.sub } })
                return new Status((affected[0] === 1), imgUrl, { data: imgUrl })
            } catch (err) {
                console.log(err);
                return new Status(false, err.message);
            }
        },

        async updateMyNick(_, { nickname }, { user }) {
            try {
                if (!user) {
                    throw new Error("not authenticated");
                }
                const users = await User.findAll({where: {nickname}});
                if(users.length){
                    return new Status(false, nickname + "is already taken. Please try to use different combination")
                }
                
                let affected = await User.update({ nickname }, { where: { authId: user.sub } });

               // console.log("affected" , affected);
                return new Status(affected[0] === 1);
            } catch (err) {
                //console.log("can't update user nickname. " + err.message)
                return new Status("can't update user nickname. " + err.message)
            }
        },

        async udpateMyDescription(_, { description }, { user }) {

            try {
                if (!user) {
                    throw new Error("not authenticated")
                }
                let { id: userId } = await User.findOne({ where: { "authId": user.sub } });
                const affected = await UserMeta.update({ description }, { where: { userId } })
                return new Status(affected[0] === 1);
            } catch (err) {
                return new Status(false, "Can't update descirption in database", err.message);
            }

        }

    }
}

module.exports = resolvers;
