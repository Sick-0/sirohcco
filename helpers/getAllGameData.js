const gameDetail = require ('./gameDetail');

module.exports = async function getAllGameData(arr) {
    let gamesToReturn = []
    let requests = arr.map(id => {
        //create a promise for each API call
        return gameDetail(id.appid)
    });

    return await Promise.all(requests).then((body) => {
        //this gets called when all the promises have resolved/rejected.
        body.forEach(res => {
            if (res) {
                if (Object.keys(res.data).length !== 0) {
                    gamesToReturn.push({appid: res.config.params.appid, gameData: res.data});
                } else {
                    console.log("FOUT HIER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                    console.log(res.data);
                }
            }
        })
        return gamesToReturn;
    }).catch(err => console.log(err))
}
