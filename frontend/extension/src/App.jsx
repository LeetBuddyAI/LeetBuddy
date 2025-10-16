import Chat from "./tabs/Chat/Chat";
import Whiteboard from "./tabs/Whiteboard/Whiteboard";
import { useState, useEffect, useContext } from "react";
import { Context } from './Store';
import { FaDisplay, FaDrawPolygon, FaMoneyBill } from "react-icons/fa6";
import laptopLogo from "./assets/leetbuddy-new.png";

function App() {
  // base design here for universal layout, then add the chat and whiteboard jsx files when tab is changed
  // tab state

  // CHANGE THIS FLAG WHEN BUILDING
  const IN_DEV_MODE = import.meta.env.VITE_IN_DEV_MODE === "true" ? true : false;

  const { pageData } = useContext(Context);
  const [page, setPage] = pageData;
  const [currentURL, setCurrentURL] = useState("");
  const [isTargetPage, setIsTargetPage] = useState(false);

  const height = 600;
  const width_chat = 400;
  const width_whiteboard = 800;

  useEffect(() => {
    // Fetch the active tab's URL
    const getActiveTabURL = async () => {
      try {
        // Query for the currently active tab in the current window
        if (IN_DEV_MODE) {
          setIsTargetPage(true);
          return;
        };
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.url) {
          // Update the state with the tab URL
          setCurrentURL(tab.url);

          // Check if the URL matches the target page
          const targetRegex = /^(?:https?:\/\/)?leetcode\.com\/problems\/.*$/;
          const isTarget = targetRegex.test(tab.url);
          
          // bool flag for checking we are on the correct page
          setIsTargetPage(isTarget);
        }
      } catch (error) {
        console.error("Error fetching tab URL:", error);
      }
    };

    getActiveTabURL();
  }, []); // Empty dependency array to ensure this runs only on component mount


  return (
    <>
      {isTargetPage ? (
      <div className="app p-1 flex flex-col" 
        style={{
          height: `${height}px`,
          width: `${page == "chat" ? width_chat : width_whiteboard}px`,
        }}>
        <div className="tabs-container flex justify-between">
          {/* Add logo here also */}
          <button className="tab-button donate-button flex items-center gap-1" onClick={(e) => {
              chrome.tabs.create({ url: "https://buymeacoffee.com/leetbuddy" });
            }}>
              <FaMoneyBill/>
              Donate
          </button>

          <div className="tabs-container flex gap-1">
            <button className="tab-button flex items-center gap-1" onClick={(e) => {
              setPage("chat");
            }}>
              <FaDisplay/>
              Chat
            </button>
            <button className="tab-button flex items-center gap-1" onClick={(e) => {
              setPage("draw");
            }}>
              <FaDrawPolygon/>
              Draw
            </button>
          </div>
          
        </div>
        
        <div className="mt-1 grow">
          {page == "chat" && <Chat/>}
          {page == "draw" && <Whiteboard/>}
        </div>
      </div>) : (
        <div className="wrong-tab-display flex flex-col justify-center items-center p-4">
          <img
            src={laptopLogo}
            alt="Laptop Logo"
            className="mb-4 leetbuddy-icon-shadow"
            style={{ width: "200px", height: "auto" }}
          />
          <p className="text-xl">
            ✦ Open a{" "}
            <a
              href="https://leetcode.com/problems/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f89f1b] underline hover:text-[#e58a0e] transition-opacity"
            >
              LeetCode
            </a>{" "}
            question to get started! ✦
          </p>
        </div>
      )}
    </>
    
  )
}

export default App
