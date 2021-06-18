function generateNewQrCode(el) {
  // clear the element's content
  el.innerHTML = '';

  // generate QR code and insert into DOM element
  new QRCode(document.getElementById(el.id), {
      text: window.location.href,
      width: 250,
      height: 250,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
  });
}

window.addEventListener('load', (event) => {
  // generate QR code placeholder element
  let qrEl = document.createElement('div');
  qrEl.id = "omni-qr-element";

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
