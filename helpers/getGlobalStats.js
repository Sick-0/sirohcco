var axios = require('axios');


module.exports = async function getGlobalStats(appid) {
    try {
        return await axios.get(
            'https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/',
            {
                params: {
                    key: process.env.API_KEY,
                    gameid: appid,
                }
            }
        );
    } catch (error) {
        console.error(error)
    }
}
