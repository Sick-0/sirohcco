export const sortAscDesc = (
  rarityDirection,
  filteredAchievements,
  setFilteredAchievements
) => {
  if (rarityDirection) {
    const tempArr = filteredAchievements.sort(function (a, b) {
      return a.percent - b.percent;
    });
    setFilteredAchievements(tempArr);
  }
  if (!rarityDirection && rarityDirection !== "") {
    const tempArr = filteredAchievements.sort(function (a, b) {
      return b.percent - a.percent;
    });
    setFilteredAchievements(tempArr);
  }
};
