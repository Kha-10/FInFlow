import { createContext, useState } from "react";

const UserSettingsContext = createContext();

const UserSettingsContextProvider = ({ children }) => {
  const [currency, setCurrency] = useState(
    () => localStorage.getItem("currency") || "USD"
  );
  const [avatarColor, setAvatarColor] = useState(
    () => localStorage.getItem("avatarColor") || "bg-blue-500"
  );

  const updateCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);
  };

  const updateAvatorColor = (newAvatarColor) => {
    setAvatarColor(newAvatarColor);
    localStorage.setItem("avatarColor", newAvatarColor);
  };

  return (
    <UserSettingsContext.Provider value={{ currency, updateCurrency,avatarColor,updateAvatorColor }}>
      {children}
    </UserSettingsContext.Provider>
  );
};

export { UserSettingsContext, UserSettingsContextProvider };
