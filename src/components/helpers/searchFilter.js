export const searchFilter = (
  searchTerm,
  filteredAchievements,
  achievements,
  isClickedAchived,
  getAchivements
) => {
  if (searchTerm && !isClickedAchived) {
    const filteredData = achievements.filter((achi) => {
      return achi.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    return getAchivements(filteredData);
  }
  if (searchTerm && isClickedAchived) {
    const filteredData = filteredAchievements.filter((achi) => {
      return achi.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    return getAchivements(filteredData);
  }
  if (!searchTerm && !isClickedAchived) return getAchivements(achievements);
};
