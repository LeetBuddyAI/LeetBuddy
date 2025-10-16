import "./Chat.css";
import { FaDisplay, FaTrashCan } from "react-icons/fa6";
import { useState, useRef, useEffect, useContext } from "react";
import LLMOutputDisplay from "../../components/LLMOutputDisplay";
import { Context } from "../../Store";
import { collectPageContent } from "./collectPageContent.js";
import laptopLogo from "../../assets/leetbuddy-new.png";
import { getApiUrl } from "../../utils/config";
import { v4 as uuidv4 } from "uuid";

const Chat = () => {
  const IN_DEV_MODE =
    import.meta.env.VITE_IN_DEV_MODE === "true" ? true : false;

  const [inputtext, setInputtext] = useState("");
  const [messages, setMessages] = useState([]);
  const [canEdit, setCanEdit] = useState(true);
  const [sessionKey, setSessionKey] = useState(null);
  const [problem, setProblem] = useState("");
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null); // Reference to the last message
  const eventSourceRef = useRef(null); // Reference to EventSource

  // base64 image context
  const { base64imageData } = useContext(Context);
  const [base64image, setBase64image] = base64imageData;

  // hovering
  const [isHovered, setIsHovered] = useState(false);

  const storage = {
    save: (data) => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.set({ chatHistory: data });
      } else {
        localStorage.setItem("chatHistory", JSON.stringify(data));
      }
    },
    load: async () => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        return new Promise((resolve) => {
          chrome.storage.local.get(["chatHistory"], (result) => {
            resolve(result.chatHistory || []);
          });
        });
      } else {
        const data = localStorage.getItem("chatHistory");
        return data ? JSON.parse(data) : [];
      }
    },
    clear: () => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.remove(["chatHistory"]);
      } else {
        localStorage.removeItem("chatHistory");
      }
    },
  };

  // Load messages from storage when component mounts
  useEffect(() => {
    const loadMessages = async () => {
      const savedMessages = await storage.load();
      if (savedMessages && savedMessages.length > 0) {
        setMessages(savedMessages);
      }
      setMessagesLoaded(true); // Set flag when messages are loaded
    };
    loadMessages();
  }, []);

  // Save messages to storage whenever they change (but not while streaming)
  useEffect(() => {
    if (messages.length > 0 && !isStreaming) {
      storage.save(messages);
    }
  }, [messages, isStreaming]);

  // Scroll to bottom when messages change or streaming content updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamingMessage]);

  // Scroll to bottom when messages are loaded from storage (on extension reopen)
  useEffect(() => {
    if (messagesLoaded && messagesEndRef.current) {
      // Add a small delay to ensure DOM is fully updated
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }, [messagesLoaded]);

  // Cleanup EventSource on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputtext === "") {
      return;
    }

    const textarea = e.target.querySelector(".chat-input-textbox");
    if (textarea) {
      try {
        textarea.style.height = "auto";
      } catch {
        console.log("error");
      }
    }

    let currentSessionKey = sessionKey;

    // Get the current active tab's URL
    if (!IN_DEV_MODE) {
      await new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const currentUrl = tabs[0]?.url;
          if (!currentUrl) {
            console.error("Could not retrieve the current tab's URL.");
            resolve();
            return;
          }

          const regex =
            /^https:\/\/leetcode\.com\/problems\/([a-zA-Z0-9][a-zA-Z0-9-]*)/;
          const match = currentUrl.match(regex);

          if (match) {
            const newProblemSlug = match[1];

            if (newProblemSlug !== problem) {
              setProblem(newProblemSlug);

              const key = uuidv4();
              sessionStorage.setItem("sessionKey", key);
              setSessionKey(key);
              currentSessionKey = key;
            }
          }
          resolve();
        });
      });
    }

    const pageText = await collectPageContent();

    let displayinputtext = inputtext;
    if (base64image !== "") {
      displayinputtext += "\n\n + 1 Image";
    }

    setMessages((prevMessages) => [...prevMessages, displayinputtext]);
    e.target.style.height = "auto";

    setCanEdit(false);
    setIsStreaming(true);
    setStreamingMessage("");

    let formattedimage = null;
    if (base64image.length > 0) {
      formattedimage = base64image?.replace(/^data:image\/\w+;base64,/, "");
    }

    const body = {
      question: inputtext,
      image: formattedimage,
      context: pageText,
      ...(currentSessionKey && { sessionID: currentSessionKey }),
    };

    if (IN_DEV_MODE) {
      body.sessionID = "test";
    }

    setBase64image("");
    setInputtext("");

    try {
      const response = await fetch(getApiUrl() + `/api/LLM`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "omit",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE messages
        const lines = buffer.split("\n");

        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim() === "") continue;

          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);

              if (parsed.error) {
                throw new Error(parsed.error);
              } else if (parsed.done) {
                // Stream completed
                setMessages((prevMessages) => [...prevMessages, fullResponse]);
                setStreamingMessage("");
                setIsStreaming(false);
                setCanEdit(true);
              } else if (parsed.chunk) {
                // Append chunk to streaming message
                fullResponse += parsed.chunk;
                setStreamingMessage(fullResponse);
              }
            } catch (e) {
              // Skip invalid JSON
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }

      // Process any remaining data in buffer
      if (buffer.trim() && buffer.startsWith("data: ")) {
        const data = buffer.slice(6);
        try {
          const parsed = JSON.parse(data);
          if (parsed.chunk) {
            fullResponse += parsed.chunk;
            setStreamingMessage(fullResponse);
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }

      // Ensure we save the final message if not already done
      if (isStreaming && fullResponse) {
        setMessages((prevMessages) => [...prevMessages, fullResponse]);
        setStreamingMessage("");
        setIsStreaming(false);
        setCanEdit(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        "Error generating response. Try again.",
      ]);
      setStreamingMessage("");
      setIsStreaming(false);
      setCanEdit(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  function handleInput(e) {
    // Reset height to auto to correctly calculate new height
    e.target.style.height = "auto";

    // Calculate new height (limited to max height)
    const newHeight = Math.min(e.target.scrollHeight, 200);

    // Set the new height
    e.target.style.height = `${newHeight}px`;

    // Update input text
    setInputtext(e.target.value);
  }

  return (
    <div
      className="main-display-box h-full flex flex-col"
      data-gramm="false"
      data-gramm_editor="false"
    >
      <div className="main-display-box-header p-2 text-sm flex justify-between">
        <div className="flex items-center gap-1">
          <FaDisplay />
          Chat
        </div>
        <button
          className="flex items-center gap-1 whiteboard-ask-button"
          onClick={(e) => {
            setMessages([]);
            setStreamingMessage("");
            setIsStreaming(false);
            storage.clear();
          }}
        >
          <FaTrashCan />
          <p>Clear</p>
        </button>
      </div>
      <div className="grow pb-2 pl-2 pr-2 flex flex-col gap-2">
        <div className="messages-display flex flex-col gap-4 grow h-40">
          {messages.length > 0 || isStreaming ? (
            <>
              {messages.map((message, index) => (
                <div key={index} className="text-sm flex flex-col">
                  {index % 2 === 0 ? (
                    <div className="message-item items-center">{message}</div>
                  ) : (
                    <LLMOutputDisplay output={message} />
                  )}
                </div>
              ))}
              {isStreaming && (
                <div className="text-sm flex flex-col">
                  {streamingMessage ? (
                    <LLMOutputDisplay output={streamingMessage} />
                  ) : (
                    <div className="generation-text">Generating...</div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex justify-center items-center flex-col">
              <img
                src={laptopLogo}
                alt="Laptop Logo"
                className="mb-4 leetbuddy-icon-shadow"
                style={{ width: "200px", height: "auto" }}
              />
              <div className="greeting-text text-center text-xl">
                Great to see you! <br /> How may I assist you today?
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="">
          <div className="button-class">
            <button
              className="button-group"
              onClick={(e) => {
                setInputtext("Can you give me some edge cases?");
              }}
            >
              Edge Cases
            </button>
            <button
              className="button-group"
              onClick={(e) => {
                setInputtext("Can you analyze my time/space complexity?");
              }}
            >
              Complexity
            </button>
            <button
              className="button-group"
              onClick={(e) => {
                setInputtext(
                  "Can I have a small hint to help me solve the problem?"
                );
              }}
            >
              Hint
            </button>
            <button
              className="button-group"
              onClick={(e) => {
                setInputtext("Can you help me debug my code?");
              }}
            >
              Bug
            </button>

            {base64image && (
              <button
                className="button-group button-image-attachment"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={(e) => {
                  setBase64image("");
                }}
              >
                {isHovered ? "X" : "1 Attachment"}
              </button>
            )}
          </div>

          <form className="" onSubmit={handleSubmit}>
            <div className="text-input w-full flex items-center relative flex-col">
              <textarea
                type="text"
                className="chat-input-textbox w-full p-2 text-sm"
                placeholder={
                  canEdit ? "Ask LeetBuddy ✦" : "Generating Response..."
                }
                onChange={(e) => setInputtext(e.target.value)}
                value={inputtext}
                maxLength="1000"
                onInput={handleInput}
                onKeyDown={handleKeyPress}
                disabled={!canEdit}
                spellCheck="false"
                autoComplete="off"
                data-gramm="false"
                data-gramm_editor="false"
              ></textarea>
              <button type="submit" className="button-group2 inside-button">
                ✦
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
