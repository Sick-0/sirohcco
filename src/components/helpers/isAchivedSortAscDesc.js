export const isAchivedSortAscDesc = (
  isClickedAchived,
  achievements,
  setFilteredAchievements,
  isAchievedFilter,
  rarityDirection
) => {
  if (isClickedAchived && rarityDirection) {
    const tempArr = achievements.filter(function (a) {
      return a.achieved === isAchievedFilter;
    });
    setFilteredAchievements(
      tempArr.sort(function (a, b) {
        return a.percent - b.percent;
      })
    );
  }
  if (isClickedAchived && !rarityDirection && rarityDirection !== "") {
    const tempArr = achievements.filter(function (a) {
      return a.achieved === isAchievedFilter;
    });
    setFilteredAchievements(
      tempArr.sort(function (a, b) {
        return b.percent - a.percent;
      })
    );
  }
};
