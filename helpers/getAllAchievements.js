const getGlobalAchievements = require('./getGlobalAchievements');
const allGames = require('./allGames');
const getAllUserAchievements = require('./getAllUserAchievements')
const getAllGameData = require('./getAllGameData');
const joinArr = require('./joinArr');
const search = require('./search ');

module.exports = //TODO improve and refactor Thanks to Xander
//Thanks to Xander
    async function getAllAchievements(userId) {

        const allUserGamesData = await allGames(userId)

        let allUserGames = allUserGamesData.data.response.games;

        //TODO hier moet beter -> has community stats liegt dus extra handeling below ;;;;; kan beter
        let GamesWithAchievements = Object.values(allUserGames).filter((array) => {
            return array.has_community_visible_stats
        });

        const userAchievements = await getAllUserAchievements(GamesWithAchievements, userId);

        let toDeleteArr = [];
        userAchievements.map(game => {
            if (game.success) {
                return game;
            } else {
                toDeleteArr.push(game.appid);;
            }
        });

        toDeleteArr.forEach(id => {
            GamesWithAchievements = GamesWithAchievements.filter(function (obj) {
                return obj.appid !== id;
            });
        })

        const globalAchievements = await getGlobalAchievements(GamesWithAchievements);
        const allGameData = await getAllGameData(GamesWithAchievements);

        let allGamesClean = userAchievements.map(achi => {
            achi.playerstats.name = achi.playerstats.gameName;
            delete achi.playerstats.gameName;
            return achi.playerstats;
        })

        const allGamesAndAchievements = joinArr("appid", GamesWithAchievements, globalAchievements, allGameData, allGamesClean);

        if (allGamesAndAchievements) {
            allGamesAndAchievements.forEach(object => {
                if (object.achievements && object.achievementData.achievements && object.gameData.game.availableGameStats.achievements) {
                    object.achievements.forEach(function (achi, index) {
                        object.achievements[index] = Object.assign(achi, search(achi.apiname, object.achievementData.achievements));
                        object.achievements[index] = Object.assign(achi, search(achi.apiname, object.gameData.game.availableGameStats.achievements));
                    })
                }
            })
        }

        allGamesAndAchievements.forEach(object => {
            delete object.achievementData;
            delete object.gameData;
        })

        return allGamesAndAchievements;
    }
