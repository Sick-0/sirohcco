const getGlobalStats = require('./getGlobalStats');

module.exports = async function getGlobalAchievements(arr) {

    let achievementsToReturn = []
    let requests = arr.map(id => {
        //create a promise for each API call
        return getGlobalStats(id.appid)
    });

    return await Promise.all(requests).then((body) => {
        //this gets called when all the promises have resolved/rejected.
        body.forEach(res => {
            if (res) {
                if (Object.keys(res.data).length !== 0) {
                    achievementsToReturn.push({
                        appid: res.config.params.gameid,
                        achievementData: res.data.achievementpercentages
                    });
                }
            }
        })
        return achievementsToReturn;
    }).catch(err => console.log(err))
}
