export const sortDateAscDesc = (
    dateDirection,
    filteredAchievements,
    setFilteredAchievements
) => {
    if (dateDirection) {
        const tempArr = filteredAchievements.sort(function (a, b) {
            return a.date - b.date;
        });
        setFilteredAchievements(tempArr);
    }
    if (!dateDirection && dateDirection !== "") {
        const tempArr = filteredAchievements.sort(function (a, b) {
            return b.date - a.date;
        });
        setFilteredAchievements(tempArr);
    }
};
