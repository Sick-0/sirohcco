
export const flipStyler = (percent, achieved, unlockTime) => {

    let returnO= {border: '', progress: '', colorBackGround: '', textColor: '', finalPercent: 0, rounded: 0 }

    if (achieved === 1) {
        returnO.colorBackGround = "purple-300"
        returnO.textColor = "black"
    } else {
        returnO.colorBackGround = "gray-300"
        returnO.textColor = "black"
    }

    if (percent < 100 && percent >= 70) {
        returnO.border = "gray-700";
        returnO.progress = "#374151"

        returnO.finalPercent = calculatePercentage(100,70,percent);

    } else if (percent < 70 && percent >= 40) {
        returnO.border = "green-600"
        returnO.progress = "#059669"

        returnO.finalPercent = calculatePercentage(70,40,percent);

    } else if (percent < 40 && percent >= 10) {
        returnO.border = "blue-500"
        returnO.progress = "#3B82F6"

        returnO.finalPercent = calculatePercentage(40,10,percent);
    } else if (percent < 10 && percent >= 1) {
        returnO.border = "purple-500"
        returnO.progress = "#8B5CF6"

        returnO.finalPercent = calculatePercentage(10,1,percent);
    } else {
        returnO.border = "yellow-500"
        returnO.progress = "#D97706"

        returnO.finalPercent = calculatePercentage(10,1,percent);
    }

    returnO.rounded = percent.toFixed(2);
    returnO.time = new Date(unlockTime * 1000);

    return returnO;
}


function calculatePercentage (upper, lower, p){
    let res1 = upper - lower;
    let res2 = res1 - (p - lower);
    let res3 = res2 / res1;
    return res3 * 100;
}
