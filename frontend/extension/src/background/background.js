import { getApiUrl } from "../utils/config";

export {};

// On install, open the guide for the user
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({
      url: `${getApiUrl()}/guide`,
    });
  }
});
