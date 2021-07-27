/* eslint no-unused-vars: 0 */
/* eslint no-undef: 0 */

// extensionEnabled
const extensionEnabledEl = document.querySelector('#extension-enabled');

extensionEnabledEl.addEventListener('click', () => {
  chrome.storage.sync.get(['extensionEnabled'], function(data) {
    chrome.storage.sync.set(
      {'extensionEnabled': !data.extensionEnabled}, function(data) {
        syncSettings();
    });
  });
})

// imageSize
const imageSizeEl = document.querySelector('#image-size');

imageSizeEl.addEventListener('change', (e) => {
  chrome.storage.sync.set({'imageSize': e.target.value}, function(data) {
    syncSettings();
  });
})

function syncSettings() {

  chrome.storage.sync.get(['extensionEnabled'], function(data) {
    let extensionEnabled = data.extensionEnabled;

    // update popup
    extensionEnabledEl.textContent = extensionEnabled ? 'Yes' : 'No';
    console.log('extensionEnabled updated: ' + extensionEnabled)

    // update content
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        omniQrExtensionEnabled: extensionEnabled
      });
    });

  });

  chrome.storage.sync.get(['imageSize'], function(data) {
    let imageSize = data.imageSize;

    // update popup
    imageSizeEl.value = imageSize;
    console.log('imageSize updated: ' + imageSize)

    // update content
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        omniQrImageSize: imageSize
      });
    });

  });

}

window.addEventListener('DOMContentLoaded', function(event) {
  syncSettings();
})
