let omniQrExtensionEnabled;
let omniQrImageSize;
let omniQrImageEl;

// get initial values
chrome.storage.sync.get(['extensionEnabled'], (data) => {
  omniQrExtensionEnabled = data.extensionEnabled;
});

chrome.storage.sync.get(['imageSize'], (data) => {
  omniQrImageSize = data.imageSize;
  if (omniQrExtensionEnabled) {
    generateNewQrCode();
  }
});

// update extension settings from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.omniQrExtensionEnabled !== undefined) {
    omniQrExtensionEnabled = request.omniQrExtensionEnabled;
    if (omniQrExtensionEnabled) {
      generateNewQrCode();
    } else {
      removeQrCode();
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.omniQrImageSize !== undefined) {
    omniQrImageSize = request.omniQrImageSize;

    if (omniQrExtensionEnabled) {
      generateNewQrCode();
    } else {
      removeQrCode();
    }
  }
});

function omniQrCodeSetup() {
  // generate QR code placeholder element
  omniQrImageEl = document.createElement('div');
  omniQrImageEl.id = "omni-qr-element";

  // add CSS styles
  omniQrImageEl.style.position = 'fixed';
  omniQrImageEl.style.right = '1rem';
  omniQrImageEl.style.bottom = '1rem';

  omniQrImageEl.style.display = 'flex';
  omniQrImageEl.style.justifyContent = 'center';
  omniQrImageEl.style.alignItems = 'center';

  omniQrImageEl.style.opacity = '0'; // set initial opacity to 0 for fade-in
  omniQrImageEl.style.transition = 'opacity 0.5s';
  omniQrImageEl.style.zIndex = '2147483646';
  omniQrImageEl.style.cursor = 'help';

  // when mouse is hovered over QR code, fade out to view content below
  let css = `
    #omni-qr-element { opacity: 0.8; }
    #omni-qr-element:hover { opacity: 0.1; }
  `;
  let style = document.createElement('style');

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  // append placeholder element to the end of the body
  document.getElementsByTagName('head')[0].appendChild(style);
  document.body.appendChild(omniQrImageEl);

  // generate first QR code
  generateNewQrCode();

  // fade in after initial render
  setTimeout(() => { omniQrImageEl.style.opacity = ''; });

  // add click listener to temporarily hide the QR code if it is in the way
  omniQrImageEl.addEventListener('click', () => {
    temporarilyHideQrCode(omniQrImageEl);
  });

  // poll for URL changes
  let currentPage = location.href;
  setInterval(() => {
    if (currentPage !== location.href) {
      currentPage = location.href;
      generateNewQrCode();
    }
  }, 2000);

  return omniQrImageEl;
}


function generateNewQrCode() {
  if (!omniQrImageEl) {
    omniQrImageEl = omniQrCodeSetup();
  }

  // clear the element's content
  omniQrImageEl.innerHTML = '';

  let extensionEnabled = omniQrExtensionEnabled ? true : false;
  let imageSize = omniQrImageSize ? omniQrImageSize : 300;

  if (extensionEnabled !== false) {
    if (window.location.href.length < 1270) {

      // generate QR code and insert into DOM element
      new QRCode(document.getElementById(omniQrImageEl.id), {
        text: window.location.href,
        width: imageSize,
        height: imageSize,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H,
      });

      // add some quality-of-life styling to the generated QR code
      omniQrImageEl.children[1].title =
        "Click to temporarily hide this QR code";
      omniQrImageEl.children[1].style.maxHeight = '90vmin';
      omniQrImageEl.children[1].style.maxWidth = '90vmin';

    } else {
      // generate error message if URL is too long
      omniQrImageEl.innerHTML = "<h2>URL too long for QR code!</h2>";
    }
  }
}

function temporarilyHideQrCode(el) {
  el.style.opacity = '0';
  setTimeout(() => {
    el.style.display = 'none';
    setTimeout(() => {
      el.style.display = '';
      setTimeout(() => {
        el.style.opacity = '';
      }, 500);
    }, 3000);
  }, 500);
}

function removeQrCode() {
  let el = document.querySelector('#omni-qr-element')
    if (el) {
      el.remove();
      omniQrImageEl = undefined;
    }
}
