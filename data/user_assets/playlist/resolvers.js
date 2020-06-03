require("dotenv").config();
const GraphQLJSON = require('graphql-type-json');
const { User, Dir, Playlist, Track , Record,  RecordTracks, Sequelize, sequelize} = require("./../../../models");


const resolvers = {
    JSON: GraphQLJSON,
    Query: {

        async root(parrent, args, { user }, opt) {
            if (!user) {
                throw new Error("not authenticated")
            }
            const { id: userId } = await User.findOne({ where: { "authId": user.sub } });

            if (!userId) {
                throw new Error("User database error - user not found" + user.sub);
            }

            const root = await Dir.findOne({ where: { "root": true, "userId": userId } });
            const dirs = await Dir.findAll({ where: { "parrent": root.id } });
            const playlists = await Playlist.findAll({ where: { "dir": root.id } });

            return {
                dir: root,
                dirs,
                playlists
            }
        },

        async dir(_, { id }) {
            const dir = await Dir.findOne({ where: { id } });
            const dirs = await Dir.findAll({ where: { "parrent": dir.id } });
            const playlists = await Playlist.findAll({ where: { "dir": dir.id } });
            return {
                dir,
                dirs,
                playlists
            }
        },

        async playlist(_, { id }) {
            const playlist = await Playlist.findOne({ where: { id } });
            const tracks = await Track.findAll({ where: { playlist: id } })
            return {
                playlist,
                tracks
            }
        }
    },


    Mutation: {
        async createDir(_, { parrentId, name }, { user }) {
            if (!user) throw new Error("not authenticated");
            const { id: userId } = await User.findOne({ where: { "authId": user.sub } })

            let dir = Dir.create({
                parrent: parrentId,
                name,
                userId
            })
            return dir;
        },
        async renameDir(_, { id, name }) {
            const res = await Dir.update({ name }, { where: { id } })
            return (res[0] === 1);
        },

        async moveDir(_, { id, targetId }) {
            const res = await Dir.update({ parrent: targetId }, { where: { id } })
            return (res[0] === 1);
        },

        async deleteDir(_, { ids }) {
            return await Dir.destroy({ where: { id: ids } });
        },

        async createPlaylist(_, { dirId, name }, { user }) {
            if (!user) throw new Error("not authenticated");
            const { id: userId } = await User.findOne({ where: { "authId": user.sub } })
            let playlist = Playlist.create({
                dir: dirId,
                name,
                userId
            })
            return playlist;
        },

        async renamePlaylist(_, { id, name }) {
            const res = await Playlist.update({ name }, { where: { id } })
            return (res[0] === 1);
        },

        async movePlaylist(_, { id, targetId }) {
            const res = await Playlist.update({ dir: targetId }, { where: { id } })
            return (res[0] === 1);
        },

        async deletePlaylist(_, { ids }) {
            const eq = Sequelize.Op.eq
            const tracks = await Track.findAll(
                {
                     where : {
                         playlist : ids, 

                         },
                     include: {
                         model: Record,
                         through: {
                            where : {
                                "recordId": {[eq] : null},
                            }
                         }
                     }
            });

            const trackIds = tracks.map( track => track.id );
            await Track.update(
                {playlist: null},
                {where : { id: trackIds }},
            )
            return await Playlist.destroy({ where: { id: ids } });
        },

        async createTrack(_, { input }, { user }) {
            const { id: userId } = await User.findOne({ where: { "authId": user.sub } })
            input.userId = userId;
            const track = await Track.create({...input});
            return track;
        },

        async updateTrack(_, { id, input }) {
            const result = await Track.update({ ...input }, { where: { id } })
            return (result[0] === 1);
        },

        async updateTracksPositions(_, { input }) {
            console.log(input)
            const t = await sequelize.transaction();
            try {
                let rows = 0;
                for (let track of input) {
                    let result = await Track.update(
                        { position: track.position },
                        {
                            where: { id: track.id },
                            transaction: t,
                        }
                    )
                    rows += result[0];
                }
                if (rows === input.length) {
                    await t.commit();
                    return true;
                }
            } catch {
                t.rollback();
                return false;
            }
        },

        async deleteTrack(_, { id }) {
            let success = false;
            try{
                const connections = await RecordTracks.findAndCountAll({ where : {id}});
                if(connections.count > 0){
                    const result = await Track.update({playlist : null}, {where: {id}})
                    success = (result[0] === 1);
                } else {
                    const result = await Track.destroy({ where: { id } })
                    success = (result === 1) 
                }
            } catch (error){
                console.log(error.message);
            } finally {
                return success;
            }

        }
    }
}

module.exports = resolvers;