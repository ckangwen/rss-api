import randUserAgent from "rand-user-agent";

export function randomUserAgent({ browser = "chrome", os = "mac os", device = "desktop" } = {}) {
  let UA = randUserAgent(browser, os, device);

  if (browser === "chrome") {
    while (
      UA.includes("Chrome-Lighthouse") ||
      UA.includes("Gener8") ||
      UA.includes("HeadlessChrome") ||
      UA.includes("SMTBot") ||
      UA.includes("Electron") ||
      UA.includes("Code")
    ) {
      UA = randUserAgent(device, browser, os);
    }
  }
  if (browser === "safari") {
    while (UA.includes("Applebot")) {
      UA = randUserAgent(device, browser, os);
    }
  }
  return UA;
}
