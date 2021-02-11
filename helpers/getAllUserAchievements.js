const getAchievements = require('./getAchievements');

module.exports = async function getAllUserAchievements(arr, userId) {

    let achievementsToReturn = []
    let requests = arr.map(id => {
        //create a promise for each API call
        return getAchievements(userId, id.appid)
    });

    //arr met appid

    return await Promise.all(requests).then((body) => {
        //this gets called when all the promises have resolved/rejected.
        body.forEach(res => {
            if (res) {

                res.data.playerstats.appid = res.config.params.appid;
                achievementsToReturn.push(res.data);
            }

        })
        return achievementsToReturn;
    }).catch((err) => {
        console.log("HIER GAAT HIJ FOUT");
        console.log(err);
    })
}
