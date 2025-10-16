export const getApiUrl = () => {
  const inDevMode = import.meta.env.VITE_IN_DEV_MODE === "true";
  return inDevMode ? "http://localhost" : import.meta.env.VITE_APP_URL;
};
