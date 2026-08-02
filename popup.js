const api = typeof browser !== "undefined" ? browser : chrome;

const DEFAULTS = {
  targetSite: "",
  allSites: true,
  probability: 5,
  enabled: true
};

function refresh() {
  api.storage.local.get(DEFAULTS, (settings) => {
    document.getElementById("siteInfo").textContent = settings.allSites
      ? "Target: all websites"
      : "Target: " + (settings.targetSite || "(not set)");
    document.getElementById("probInfo").textContent =
      "Chance: " + settings.probability + "%";
    document.getElementById("enabledToggle").checked = settings.enabled;
  });
}

document.addEventListener("DOMContentLoaded", refresh);

document.getElementById("enabledToggle").addEventListener("change", (e) => {
  api.storage.local.set({ enabled: e.target.checked });
});

document.getElementById("openOptions").addEventListener("click", () => {
  api.runtime.openOptionsPage();
});
