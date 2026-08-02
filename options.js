const api = typeof browser !== "undefined" ? browser : chrome;

const DEFAULTS = {
  targetSite: "",
  allSites: true,
  probability: 10,
  enabled: true,
};

function load() {
  api.storage.local.get(DEFAULTS, (settings) => {
    document.getElementById("enabled").checked = settings.enabled;
    document.getElementById("probability").value = settings.probability;
  });
}

function save() {
  const settings = {
    enabled: document.getElementById("enabled").checked,
    targetSite: document.getElementById("targetSite").value.trim(),
    allSites: document.getElementById("allSites").checked,
    probability: Math.max(0, Math.min(100, Number(document.getElementById("probability").value) || 0)),
  };
  api.storage.local.set(settings, () => {
    const status = document.getElementById("status");
    if (api.runtime.lastError) {
      status.style.color = "red";
      status.textContent = "Error saving: " + api.runtime.lastError.message;
      return;
    }
    status.style.color = "green";
    status.textContent = "Saved.";
    setTimeout(() => (status.textContent = ""), 1500);
  });
}

document.addEventListener("DOMContentLoaded", load);
document.getElementById("save").addEventListener("click", save);
