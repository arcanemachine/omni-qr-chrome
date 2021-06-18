window.addEventListener('load', (event) => {

  // generate QR code placeholder element
  const qrEl = document.createElement('div');
  qrEl.id = "omni-qr-element";

  // append placeholder element to the end of the body
  document.body.appendChild(qrEl);

  function generateNewQrCode() {
    // clear the element's content
    qrEl.innerHTML = '';

    // generate QR code and insert into generated DOM element
    let qrcode = new QRCode(document.getElementById(qrEl.id), {
        text: window.location.href,
        width: 250,
        height: 250,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
  }

  generateNewQrCode();

  // TODO: update the qr code when the URL changes
  // setInterval(() => {
  //   generateNewQrCode()
  // }, 10);
})
