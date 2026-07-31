const api = typeof browser !== "undefined" ? browser : chrome;

const DEFAULTS = {
  allSites: true,    
  probability: 10,   
  enabled: true,
};

function getSettings() {
  return new Promise((resolve) => {
    api.storage.local.get(DEFAULTS, (stored) => {
      resolve(stored || DEFAULTS);
    });
  });
}

function hostnameMatches(hostname, targetSite) {
  if (!targetSite) return false;
  const target = targetSite.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
  const host = hostname.toLowerCase();
  return host === target || host.endsWith("." + target);
}

api.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return;

  const settings = await getSettings();
  console.log("[EggRoom] nav check:", details.url, settings);

  if (!settings.enabled) {
    console.log("[EggRoom] disabled, skipping");
    return;
  }

  let url;
  try {
    url = new URL(details.url);
  } catch (e) {
    return;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  const matches = settings.allSites || hostnameMatches(url.hostname, settings.targetSite);
  console.log("[EggRoom] hostname:", url.hostname, "target:", settings.targetSite, "allSites:", settings.allSites, "matches:", matches);
  if (!matches) return;

  const roll = Math.random() * 100;
  console.log("[EggRoom] roll:", roll, "probability:", settings.probability);
  if (roll < settings.probability) {
    const redirectUrl = api.runtime.getURL("eggroom.html");
    console.log("[EggRoom] redirecting to", redirectUrl);
    api.tabs.update(details.tabId, { url: redirectUrl });
  }
});
