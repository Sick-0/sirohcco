export const isAchived = (
  isClickedAchived,
  achievements,
  setFilteredAchievements,
  isAchievedFilter
) => {
  if (isClickedAchived) {
    const tempArr = achievements.filter(function (a) {
      return a.achieved === isAchievedFilter;
    });
    setFilteredAchievements(tempArr);
  }
};
