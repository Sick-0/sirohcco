var axios = require('axios');

module.exports = async function gameDetail(appid) {
    try {
        return await axios.get(
            'http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2',
            {
                params: {
                    key: process.env.API_KEY,
                    appid: appid,
                }
            }
        );
    } catch (error) {
        console.error(error)
    }
}
