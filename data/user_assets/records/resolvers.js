require("dotenv").config();
const GraphQLJSON = require('graphql-type-json');
const { 
    Sequelize, 
    Record,
    Track, 
    Genre, 
    User, 
    RecordGenres,
    RecordTracks, 
    FavoriteRecord,
    Comment} = require("./../../../models");


const resolvers = {
    JSON: GraphQLJSON,
    Query: {
        async records(_, { input }, { user }) {
            const { or, iLike } = Sequelize.Op;

            let currentUserId
            if(user){
               ({ id: currentUserId } = await User.findOne({ where: { "authId": user.sub } }))
            }

            let {
                id,
                userId = null,
                nickname= null,
                query = null,
                queryOpt = null,
                genreNames = null,
                pagin = null,
                title = null,
            } = input;

            if(nickname){
                let user = await User.findOne({where: {nickname}})
                if(user){
                    userId = user.id;
                }
            }

            let offset, limit = null;
            if (pagin) {
                offset = pagin.page * pagin.pageSize;
                limit = pagin.pageSize;
            }

            let where = {}
            if (id) {
                where.id = id;
            }

            if(query && (!queryOpt || queryOpt && !queryOpt.includes('no-artist'))){
                let users = await User.findAll({where: {nickname : {[iLike] : '%'+query+'%'}}})
                where.userId = users && users.map( user => user.id);
            }

            if (userId) {
                where.userId = userId;
            }

            if (title) {
                where.title = title;
            }

            if (query) {
                const titleLike = {}
                const descriptionLike = {}
                if(!queryOpt || (queryOpt && !queryOpt.includes('no-title'))){
                    titleLike.title = { [iLike]: `%${query}%` }
                }
                if(!queryOpt || queryOpt && !queryOpt.includes('no-description')){
                    descriptionLike.description = { [iLike]: `%${query}%` }
                }
                where = {
                    [or]: [
                        {...where},
                        {...titleLike },
                        {...descriptionLike }
                    ]
                }
            }

            const whereGeners = {};
            if(genreNames){
                whereGeners.where = {
                    name : genreNames
                }
            }


            const include = [];

            include.push({
                model: User,
                as: 'user',
                where: {
                    id: { [Sequelize.Op.col]: 'Record.userId' },
                },
            });

            include.push({
                model: Genre,
                as: "genres",
                ...whereGeners,
            })

            if(currentUserId){
                include.push({
                    model: User,
                    as: "favorited",
                    through: {
                        where: { 
                            userId : currentUserId,
                        },
                        attributes: []
                    },
                })
            }

            let result = await Record.findAll({
                offset,
                limit,
                where,
                include: [...include],
                order: [['createdAt', 'DESC']],
            })

            const count = await Record.count({
                where,
            })

            if(currentUserId){
                result.rows = result.map(record => {
                    record.favorited = (record.favorited && record.favorited.length > 0)
                    return record;
                })
            }

            return {
                records: result,
                countAll: count
            };
        },

        async record(_, {id}){
            let result = await Record.findOne({
                where:{id},
                include: [{
                        model: User,
                        as: 'user',
                        where: {
                            id: { [Sequelize.Op.col]: 'Record.userId' },
                        }
                    },{
                        separate:true,
                        right: true,
                        model: Comment,
                        as: 'comments',
                        where: {
                            "recordId": id
                        },

                        include: [{
                            model: User,
                            as: 'user',
                        }, 
                        {
                            model:Record,
                            as: 'record',
                            where:{
                                id
                            }
                        }],
                     },{
                         model: Track,
                         as: "tracks",
                         through: {
                           attributes: ['start', 'end']
                         }
                         
                     }
                    
                ],
            })

            result.tracks = result.tracks.map( track => ({
                start: track.RecordTracks.start,
                end: track.RecordTracks.end,
                track
            }))
            return result;
        },

        async genres(_, {limit}){
            const genres = await RecordGenres.findAll({
                attributes: [
                    [Sequelize.literal('COUNT(*)'), "count"]
                ],
                group: ["Genre.id"],
                order: [[Sequelize.literal('count'), 'DESC']],
                limit,
                include :{
                    attributes: ["name", "id"],
                    model: Genre,
                    required: true,
                }
            })
            
            return genres.map(row => row.Genre);
        }
    },


    Mutation: {
        async createRecord(_, { title }, { user }) {
            if (!user) throw new Error("not authenticated");
            const { id: userId } = await User.findOne({ where: { "authId": user.sub } })
            //   console.log("the user id" , userId)
            if (!userId) throw new Error("user doesn't exist");


            const record = Record.create({
                userId,
                title
            })
            //     console.log(record)
            return record;
        },

        async updateRecord(_, { id, input }, {user}) {
            if (!user) throw new Error("not authenticated");
            if (input.genres) {
                let genresIds = [];
                for (let genre of input.genres) {
                    let gen = await Genre.findOrCreate({
                        where: { name: genre },
                        defaults: { name: genre }
                    })
                    genresIds.push(gen[0].id)
                }
                input.genres = genresIds;
                await RecordGenres.destroy({
                    where: {
                     recId: id,
                     genId: {[Sequelize.Op.notIn]: genresIds},   
                    }})
                for(let genId of genresIds){
                    await RecordGenres.findOrCreate({
                        where: {recId: id, genId},
                        defaults: {recId: id, genId}
                    })
                }

            }

            if(input.tracks){
                const tracks = input.tracks.map(track => ({
                    trackId: track.id,
                    recordId: id,
                    start: track.start,
                    end : track.end
                }))

                if(tracks.length){
                    await RecordTracks.bulkCreate(tracks)
                }
            }

            const result = await Record.update({ ...input }, { where: { id } })
            return (result[0] === 1);
        },

        async deleteRecord(_, { id }, {user}) {
            if (!user) throw new Error("not authenticated");
            const result = await Record.destroy({ where: { id } })
            console.log("DELTE RECORD RESULT", result)
            return (result === 1)
        },

        async addGenre(_, { name }) {
            if (!user) throw new Error("not authenticated");
            const id = Genre.create({ name });
            return id;
        },

        async createComment(_, {input}, {user}){
            if (!user) throw new Error("not authenticated");
            const { id: userId } = await User.findOne({ where: { "authId": user.sub } })
            if(userId !== input.userId ) return;
            //to implemet or user.role 
            let comment = await Comment.create(input);
            comment.user = await User.findOne({where: {id: userId}})
            comment.record = await Record.findOne({where: {id: input.recordId}})
            return comment;
        },

        async updateComment(_, {input}, {user}){
            if (!user) throw new Error("not authenticated");
            const { id: userId } = await User.findOne({ where: { "authId": user.sub } })
            //to implemet or user.role 
            const where = {
                id : input.commentId,
                userId
            }
            let result  = await Comment.update({text: input.text}, {where});
            return (result[0] === 1)        
        },

        async deleteComment(_, {id}, {user}){
            if (!user) throw new Error("not authenticated");
            const { id: userId } = await User.findOne({ where: { "authId": user.sub } })
           //to do implement role
            const result = await Comment.destroy({where: {id, userId}})
            return (result === 1);
        },

        async addToFavorite(_ , {recordId}, {user}){
          //  console.log("recordid", recordId)
            if(!user) throw new Error("not authenticated");
            const {id: userId} = await User.findOne({where: {"authId": user.sub}});
            const result = await FavoriteRecord.findOrCreate({
                where : {userId, recordId},
                defaults: {userId, recordId}
            });
            return ((result[0].dataValues !== undefined));
        },

        async removeFavorite(_, {recordId}, {user}){
            if(!user) throw new Error("not authenticated");
            const {id: userId} = await User.findOne({where: {"authId": user.sub}});
            const result = await FavoriteRecord.destroy({where: {userId, recordId}});
            return (result === 1);
        }
    }
}

module.exports = resolvers;