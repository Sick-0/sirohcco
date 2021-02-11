var axios = require('axios');

module.exports = async function getAchievements(id, appid) {
    try {
        return await axios.get(
            'https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/',
            {
                params: {
                    key: process.env.API_KEY,
                    steamid: id,
                    appid: appid,
                }
            }
        );
    } catch (error) {
        console.error(error)
    }
}
