const waitForElement = (selector: string, cb: (el: Element) => void) => {
  const el = document.querySelector(selector);
  if (el) return cb(el);

  const obs = new MutationObserver((_, o) => {
    const found = document.querySelector(selector);
    if (found) { o.disconnect(); cb(found); }
  });
  obs.observe(document.body, { childList: true, subtree: true });
};

export default waitForElement;
