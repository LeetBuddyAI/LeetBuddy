export const collectPageContent = async () => {
  try {
    // Get the current active tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab) {
      console.error("No active tab found");
      return;
    }

    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // Clone the body
        const clone = document.body.cloneNode(true);

        // Check if an element is hidden from view
        function isHiddenInLiveDOM(el) {
          if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;

          const style = window.getComputedStyle(el);
          if (
            !style ||
            style.display === "none" ||
            style.visibility === "hidden" ||
            parseFloat(style.opacity) === 0
          ) {
            return true;
          }

          return el.parentElement && isHiddenInLiveDOM(el.parentElement);
        }

        // Remove any hidden elements
        function removeHiddenElements(liveEl, cloneEl) {
          const liveChildren = Array.from(liveEl.childNodes);
          const cloneChildren = Array.from(cloneEl.childNodes);

          for (let i = 0; i < liveChildren.length; i++) {
            const liveChild = liveChildren[i];
            const cloneChild = cloneChildren[i];

            if (!cloneChild) continue;

            if (liveChild.nodeType === Node.ELEMENT_NODE) {
              if (isHiddenInLiveDOM(liveChild)) {
                cloneChild.remove(); // remove from the clone
              } else {
                removeHiddenElements(liveChild, cloneChild);
              }
            }
          }
        }

        removeHiddenElements(document.body, clone);

        // Replace <sup> in the clone with '^' + {text}
        clone.querySelectorAll("sup").forEach((supEl) => {
          supEl.replaceWith("^{" + supEl.innerText + "}");
        });

        // Also replace <sub> in the clone with '_' + {text}
        clone.querySelectorAll("sub").forEach((subEl) => {
          subEl.replaceWith("_{" + subEl.innerText + "}");
        });

        // Create an offscreen container so the clone can be rendered (layout computed)
        const offscreenContainer = document.createElement("div");
        offscreenContainer.style.position = "absolute";
        offscreenContainer.style.left = "-999999px";
        offscreenContainer.style.top = "0";
        // (optional) set width to mimic the real body width if you want more accurate line breaks
        // offscreenContainer.style.width = '1200px';

        // Add it to the DOM
        document.documentElement.appendChild(offscreenContainer);

        // Move the clone inside the container
        offscreenContainer.appendChild(clone);

        // Read the innerText from the now-rendered clone
        let finalText = clone.innerText;

        // Limit to 20,000 characters
        const MAX_CHARS = 20000;
        if (finalText.length > MAX_CHARS) {
          finalText = finalText.substring(0, MAX_CHARS);
        }

        // Remove the offscreen container
        offscreenContainer.remove();

        // Return the final text to the extension
        return finalText;
      },
    });

    return result;
  } catch (error) {
    console.error("Error collecting page content:", error);
    return null;
  }
};
