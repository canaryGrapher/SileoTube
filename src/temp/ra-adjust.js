(function () {
  const target = document.querySelector("#contents");
  if (!target) return;

  // --- Step 1: Create new wrapper and prepend ---
  const wrapper = document.createElement("div");
  wrapper.id = "calmtube-search-wrapper";
  wrapper.innerHTML = `
    <div id="calmtube-searchbox">
      <input id="calmtube-input" type="text" placeholder="Search" />
      <button id="calmtube-search-btn" aria-label="Search">
        <svg height="20" width="20" viewBox="0 0 24 24"><path fill="white" d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 001.48-5.34C15.37 5.59 12.28 3 8.5 3S1.63 5.59 1.09 8.39c-.69 3.77 2.08 7.11 5.78 7.57 1.61.21 3.11-.23 4.31-1.13l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49L15.5 14zM8.5 13c-2.48 0-4.5-2.02-4.5-4.5S6.02 4 8.5 4s4.5 2.02 4.5 4.5S10.98 13 8.5 13z"/></svg>
      </button>
      <button id="calmtube-voice-btn" aria-label="Voice search">
        <svg height="20" width="20" viewBox="0 0 24 24"><path fill="white" d="M12 14a2 2 0 002-2V6a2 2 0 10-4 0v6a2 2 0 002 2zM19 11a1 1 0 00-1 1 6 6 0 01-12 0 1 1 0 00-2 0 8 8 0 0017 0 1 1 0 00-1-1z"/></svg>
      </button>
    </div>
  `;
  target.prepend(wrapper);

  // --- Step 2: Add minimal CSS for centering ---
  const style = document.createElement("style");
  style.id = "calmtube-style";
  style.textContent = `
    #calmtube-search-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
      margin-bottom: 24px;
    }
    #calmtube-searchbox {
      display: flex;
      align-items: center;
      background: #121212;
      border: 1px solid #333;
      border-radius: 40px;
      padding: 8px;
      width: 600px;
      max-width: 90%;
    }
    #calmtube-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: white;
      font-size: 16px;
      padding: 8px 16px;
    }
    #calmtube-search-btn, #calmtube-voice-btn {
      background: #212121;
      border: none;
      outline: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      margin-left: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    #calmtube-search-btn:hover, #calmtube-voice-btn:hover {
      background: #2a2a2a;
    }
  `;
  document.head.appendChild(style);

  // --- Step 3: Hook to original YouTube elements ---
  const originalInput = document.querySelector(
    "#center > yt-searchbox > div.ytSearchboxComponentInputBox.ytSearchboxComponentInputBoxDark > form > input"
  );
  const originalSearchBtn = document.querySelector("#center > yt-searchbox > button");
  const originalVoiceBtn = document.querySelector(
    "#voice-search-button > ytd-button-renderer > yt-button-shape > button"
  );

  if (!originalInput) return;

  const newInput = document.querySelector("#calmtube-input");
  const newSearchBtn = document.querySelector("#calmtube-search-btn");
  const newVoiceBtn = document.querySelector("#calmtube-voice-btn");

  // --- Step 4: Mirror input both ways ---
  // Avoid event listeners; use property binding and MutationObserver
  Object.defineProperty(newInput, "value", {
    get() {
      return originalInput.value;
    },
    set(v) {
      originalInput.value = v;
      originalInput.dispatchEvent(new InputEvent("input", { bubbles: true }));
    },
  });

  const mirrorObserver = new MutationObserver(() => {
    newInput.value = originalInput.value;
  });
  mirrorObserver.observe(originalInput, { attributes: true, attributeFilter: ["value"] });

  // --- Step 5: Hook search & voice buttons ---
  if (originalSearchBtn && newSearchBtn)
    newSearchBtn.onclick = () => originalSearchBtn.click();
  if (originalVoiceBtn && newVoiceBtn)
    newVoiceBtn.onclick = () => originalVoiceBtn.click();

  // --- Step 6: Easy cleanup hook ---
  window.removeCalmTubeSearch = function () {
    document.querySelector("#calmtube-search-wrapper")?.remove();
    document.querySelector("#calmtube-style")?.remove();
    mirrorObserver.disconnect();
  };
})();