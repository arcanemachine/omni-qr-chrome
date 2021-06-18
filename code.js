function generateNewQrCode(el) {
  // clear the element's content
  el.innerHTML = '';

  if (window.location.href.length < 1270) {
    // generate QR code and insert into DOM element
    new QRCode(document.getElementById(el.id), {
        text: window.location.href,
        width: 300,
        height: 300,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H,
    });
  } else {
    // generate message if URL is too long
    el.innerHTML = "<h2>URL too long for QR code!</h2>";
  }
  el.children[1].title = "Click to temporarily hide this QR code";
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

  qrEl.style.opacity = '0'; // opacity initially set to 0 to allow fade-in
  qrEl.style.transition = 'opacity 0.5s';
  qrEl.style.zIndex = '2147483646';


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
  document.body.appendChild(qrEl);

  // generate first QR code
  generateNewQrCode(qrEl);

  // fade in after initial render
  setTimeout(() => {
    qrEl.style.opacity = '';
  });

  // add click listener to temporarily hide the QR code if it is in the way
  qrEl.addEventListener('click', () => {
    temporarilyHideQrCode(qrEl);
  });
})

// update the QR code when the URL changes
window.addEventListener('hashchange', function() { 
  generateNewQrCode(document.querySelector('#omni-qr-element'));
})

window.addEventListener('popstate', function() { 
  generateNewQrCode(document.querySelector('#omni-qr-element'));
})
