
module.exports = function joinArr(key, ...ar) {
    let arrs = [];
    ar.forEach(a => arrs = [...arrs, ...a]);
    const noDuplicate = arr => [...new Set(arr)]
    const allIds = arrs.map(ele => ele[key]);
    const ids = noDuplicate(allIds);

    return ids.map(id =>
        arrs.reduce((self, item) => {
            return item[key] === id ?
                {...self, ...item} : self
        }, {})
    )
}
