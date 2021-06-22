// default settings
let extensionEnabled = true;
let imageSize = 300;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ extensionEnabled });
  chrome.storage.sync.set({ imageSize });
  console.log(`extensionEnabled set to ${extensionEnabled}`);
  console.log(`imageSize set to ${imageSize}`);
});
