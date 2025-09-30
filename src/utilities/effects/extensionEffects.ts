import browser from 'webextension-polyfill'

/**
 * Handles side effects when extension enable/disable state changes
 * Manages content script injection and removal based on extension state
 */
export function handleExtensionToggle(isEnabled: boolean) {
  // alert('handleExtensionToggle called with isEnabled: ' + isEnabled)
  if (isEnabled) {
    // Inject content script to start modifying YouTube
    browser.tabs.query({ url: '*://*.youtube.com/' }).then((tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          browser.scripting.executeScript({
            target: { tabId: tab.id },
             func: () => {
               const searchBox = document.querySelector('#masthead > #container > #center');
               const rightArrow = document.querySelector("#right-arrow")
               const contentsChildren = document.querySelectorAll('#contents *')
               const backgroundTarget = document.querySelector("#primary")
               const mastheadContainer = document.querySelector("#center.ytd-masthead")
               const chipContainer = document.querySelector("#primary > ytd-rich-grid-renderer")

               if (searchBox instanceof HTMLElement) {
                 // hide the right arrow
                 if (rightArrow instanceof HTMLElement) rightArrow.style.display = 'none';

                 // select all children of div #contents and hide them
                 contentsChildren.forEach((childElement) => {
                   if (childElement instanceof HTMLElement) childElement.style.display = 'none';
                 });

                 // set background image of #primary to mountain image
                 if (backgroundTarget instanceof HTMLElement) {
                   backgroundTarget.style.backgroundImage = 'url("https://images.pexels.com/photos/326235/pexels-photo-326235.jpeg")';
                   backgroundTarget.style.backgroundSize = 'cover'
                   backgroundTarget.style.backgroundPosition = 'center'
                   backgroundTarget.style.backgroundRepeat = 'no-repeat'
                   backgroundTarget.style.minHeight = '100vh'
                 }

                 // Create centered content container
                 const centerContainer = document.createElement('div');
                 centerContainer.id = 'calmtube-center';
                 Object.assign(centerContainer.style, {
                   position: 'absolute',
                   top: '50%',
                   left: '50%',
                   transform: 'translate(-50%, -50%)',
                   flexDirection: 'column',
                   alignItems: 'center',
                   gap: '24px',
                   zIndex: '9999',
                   width: '100%',
                   maxWidth: '800px',
                 });

                 // Create purpose text
                 const purposeText = document.createElement('div');
                 purposeText.textContent = 'Remember your purpose!!';
                 Object.assign(purposeText.style, {
                   color: 'rgb(255 255 255 / 65%)',
                   fontSize: '40px',
                   fontWeight: 'bold',
                   textAlign: 'center'
                 });

                 if (mastheadContainer instanceof HTMLElement) Object.assign(mastheadContainer.style, {
                   flex: ''
                 });

                 if (chipContainer instanceof HTMLElement) Object.assign(chipContainer.style, {
                   display: 'none'
                 });

                 // Style the search box
                 Object.assign(searchBox.style, {
                   display: 'flex',
                   width: '100%',
                   borderRadius: '40px',
                   padding: '12px 20px',
                 });

                 // Add elements to container
                 centerContainer.appendChild(purposeText);
                 centerContainer.appendChild(searchBox);

                 // Add container to page
                 if (backgroundTarget instanceof HTMLElement) {
                   backgroundTarget.appendChild(centerContainer);
                 }
               }
             }
          })
        }
      })
    }).catch(() => {
      // Content script already injected or tab not accessible
      alert('Content script already injected or tab not accessible')
    })
  }
  else {
    // Remove content script modifications
    browser.tabs.query({ url: '*://*.youtube.com/' }).then((tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          browser.scripting.executeScript({
            target: { tabId: tab.id },
             func: () => {
               // Clean up CalmTube elements
               const centerContainer = document.querySelector('#calmtube-center');
               if (centerContainer) centerContainer.remove();

               const backgroundTarget = document.querySelector("#primary");
               if (backgroundTarget instanceof HTMLElement) {
                 backgroundTarget.style.backgroundImage = '';
                 backgroundTarget.style.backgroundSize = '';
                 backgroundTarget.style.backgroundPosition = '';
                 backgroundTarget.style.backgroundRepeat = '';
                 backgroundTarget.style.minHeight = '';
               }

               // Show full-screen loading overlay then reload
               try {
                 const overlay = document.createElement('div');
                 overlay.id = 'calmtube-loading-overlay';
                 Object.assign(overlay.style, {
                   position: 'fixed',
                   inset: '0',
                   background: 'rgba(0,0,0,0.85)',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   zIndex: '2147483647',
                   color: '#fff',
                   fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
                 } as CSSStyleDeclaration);

                 const spinner = document.createElement('div');
                 Object.assign(spinner.style, {
                   width: '56px',
                   height: '56px',
                   border: '6px solid rgba(255,255,255,0.2)',
                   borderTopColor: '#fff',
                   borderRadius: '50%',
                   animation: 'calmtube-spin 1s linear infinite',
                 } as CSSStyleDeclaration);

                 const style = document.createElement('style');
                 style.textContent = '@keyframes calmtube-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';

                 overlay.appendChild(spinner);
                 document.documentElement.appendChild(style);
                 document.documentElement.appendChild(overlay);

                 // Allow a frame to paint before reload
                 setTimeout(() => {
                   document.location.reload();
                 }, 50);
               } catch (_) {
                 document.location.reload();
               }
             }
          })
            .catch(() => {
              // Content script already injected or tab not accessible
              alert('Content script already injected or tab not accessible')
            })
        }
      })
    })
  }
}