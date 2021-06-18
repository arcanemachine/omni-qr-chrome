function generateNewQrCode(el) {
  // clear the element's content
  el.innerHTML = '';

  if (window.location.href.length < 1270) {
    // generate QR code and insert into DOM element
    new QRCode(document.getElementById(el.id), {
        text: window.location.href,
        width: 250,
        height: 250,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
  } else {
    // generate message if URL is too long
    el.innerHTML = "<h2>URL too long for QR code!</h2>";
  }
}

window.addEventListener('load', (event) => {
  // generate QR code placeholder element
  let qrEl = document.createElement('div');
  qrEl.id = "omni-qr-element";

  // add CSS styles
  qrEl.style.position = 'fixed';
  qrEl.style.bottom = '1.5rem';
  qrEl.style.right = '1.5rem';

  qrEl.style.display = 'flex';
  qrEl.style.justifyContent = 'center';
  qrEl.style.alignItems = 'center';

  qrEl.style.transition = 'opacity 0.5s';
  qrEl.style.zIndex = '1000';

  // when mouse is hovered over 
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

  document.getElementsByTagName('head')[0].appendChild(style);

  // append placeholder element to the end of the body
  document.body.appendChild(qrEl);

  // generate first QR code
  generateNewQrCode(qrEl);
})

// update the QR code when the URL changes
window.addEventListener('hashchange', function() { 
  generateNewQrCode(document.querySelector('#omni-qr-element'));
})

window.addEventListener('popstate', function() { 
  generateNewQrCode(document.querySelector('#omni-qr-element'));
})
