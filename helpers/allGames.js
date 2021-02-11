var axios = require('axios');

module.exports = async function allGames(id) {
    try {
        return await axios.get(
            'https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/',
            {
                params: {
                    key: process.env.API_KEY,
                    steamid: id,
                    include_appinfo: 'true',
                    include_played_free_games: 'true',
                }
            }
        );
    } catch (error) {
        console.error(error)
    }
}
