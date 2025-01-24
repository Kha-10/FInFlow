export const saveUserSettings = (settings) => {
  localStorage.setItem("user", JSON.stringify(settings));
};

export const loadUserSettings = () => {
  const settings = localStorage.getItem("user");
  return settings ? JSON.parse(settings) : null;
};
