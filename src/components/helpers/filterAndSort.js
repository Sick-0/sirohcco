const filterObjectArray = require('filter-object-array');

export const filterAndSort = async (
    filters = {},
    sorts = {},
    games= [],
    searchTerm = '',
    originalArr = []
) => {


    //filters should look like { property: value, property2: value2, ... }
    //first check if filters -> apply to original array each of them
    //filters only work on one to one relation
    let afterGameFilterArr = [];
    //check first if game filters and then only continue with those
    if (games.length){
        games.forEach(value => {
            const tempArr = originalArr.filter(function (a) {
                return a.appid === value;
            });
            afterGameFilterArr = [...afterGameFilterArr, ...tempArr];
        })
    }
    else
    {
        afterGameFilterArr = originalArr;
    }



    let returnArr = afterGameFilterArr;
    let afterFilterArr = [];
    console.log(filters);
    if (filters) {
        console.log("there are filters!")
        afterFilterArr = await filterObjectArray({array: afterGameFilterArr, objFilter: filters})
        returnArr = afterFilterArr;
        console.log(returnArr);

    }
    console.log(afterFilterArr);

    let afterSearchArr = [];
    if (searchTerm !== '') {
        console.log("there is a searchterm!")
        afterSearchArr = afterFilterArr.filter((a) => {
            return a.displayName.toLowerCase().includes(searchTerm.toLowerCase());
        });
        returnArr = afterSearchArr;
        console.log(returnArr);
    }
    else
    {
        //if no search do update afterSearch for the sort ;)
        afterSearchArr = returnArr;
    }

    console.log(afterSearchArr);

    //sorts should look like { property to sort: direction }
    //then check if sort is there -> apply to newArray

    let sortedNewArr = [];


    if (sorts.rarity) {
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

    //return value should be new achievement array filtered and sorted
    console.log(returnArr);
    return returnArr;
};
