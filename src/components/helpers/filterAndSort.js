const filterObjectArray = require('filter-object-array');

export const filterAndSort = async (
    filters = {},
    sorts = {},
    games = [],
    searchTerm = '',
    originalArr = []
) => {


    //filters should look like { property: value, property2: value2, ... }
    //first check if filters -> apply to original array each of them
    //filters only work on one to one relation
    let afterGameFilterArr = [];
    //check first if game filters and then only continue with those
    if (games.length) {
        games.forEach(value => {
            const tempArr = originalArr.filter(function (a) {
                return a.appid === value;
            });
            afterGameFilterArr = [...afterGameFilterArr, ...tempArr];
        })
    } else {
        afterGameFilterArr = originalArr;
    }


    let returnArr = afterGameFilterArr;
    let afterFilterArr = [];
    if (filters) {
        afterFilterArr = await filterObjectArray({array: afterGameFilterArr, objFilter: filters})
        returnArr = afterFilterArr;

    }

    let afterSearchArr = [];
    if (searchTerm !== '') {
        afterSearchArr = afterFilterArr.filter((a) => {
            return a.displayName.toLowerCase().includes(searchTerm.toLowerCase());
        });
        returnArr = afterSearchArr;
    } else {
        //if no search do update afterSearch for the sort ;)
        afterSearchArr = returnArr;
    }

    //sorts should look like { sort: what kind of sort, direction: true false }
    //then check if sort is there -> apply to newArray

    let sortedNewArr = [];


    if (sorts) {
        if (sorts.sort === "rarity") {
            if (sorts.direction) {
                sortedNewArr = afterSearchArr.sort(function (a, b) {
                    return a.percent - b.percent;
                });
                returnArr = sortedNewArr
            } else {
                sortedNewArr = afterSearchArr.sort(function (a, b) {
                    return b.percent - a.percent;
                });
                returnArr = sortedNewArr
            }
        } else if (sorts.sort === "date") {
            if (sorts.direction) {
                sortedNewArr = afterSearchArr.sort(function (a, b) {
                    return b.unlocktime - a.unlocktime;
                });
                returnArr = sortedNewArr
            } else {
                sortedNewArr = afterSearchArr.sort(function (a, b) {
                    return a.unlocktime - b.unlocktime;
                });
                returnArr = sortedNewArr
            }
        }
    }
//return value should be new achievement array filtered and sorted
    return returnArr;
}

