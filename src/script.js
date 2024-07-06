// Buat munculin tombol download all kalo rendered name ga kosong
function toggleDownloadButton() {
  const renderedName = document.getElementById("Rendered-name");
  const downloadButton = document.getElementById("download-all-button");
  if (renderedName.innerHTML.trim() === "") {
    downloadButton.classList.add("hidden");
  } else {
    downloadButton.classList.remove("hidden");
  }
}

// Buat render nama
function renderNames() {
  const input = document.getElementById("names-input").value;
  const names = input.split(",").map((name) => name.trim());
  const container = document.getElementById("Rendered-name");
  container.innerHTML = "";

  const previewText = document.getElementById("name");
  names.forEach((name, index) => {
    const nameItem = document.createElement("div");
    nameItem.className = "name-item";

    const nameText = document.createElement("span");
    nameText.textContent = name;
    nameItem.appendChild(nameText);

    const downloadButton = document.createElement("button");
    downloadButton.id = "download-button";
    downloadButton.textContent = `Download`;
    downloadButton.onclick = () => {
      previewText.textContent = name;
      downloadAsImage(name, index);
    };
    nameItem.appendChild(downloadButton);

    container.appendChild(nameItem);
  });

  toggleDownloadButton();
}

toggleDownloadButton();

// buat download gambar
function downloadAsImage(name, index) {
  const captureElement = document.getElementById("image-preview");
  const width = document.getElementById("width").value;
  const height = document.getElementById("height").value;
  captureElement.style.transform = "scale(1)";
  captureElement.style.width = `${width}px`;
  captureElement.style.height = `${height}px`;
  console.log(width, height);
  html2canvas(captureElement, {
    width: width, // custom width
    height: height, // custom height
  }).then(function (canvas) {
    var dataURL = canvas.toDataURL("image/png");
    var link = document.createElement("a");
    link.download = `${name}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    captureElement.style.transform = "scale(0.5)";
  });
}

// Buat ubah nilai top & left posisi nama
// document.getElementById("top").onchange = function () {
//   const topVal = document.getElementById("top").value;
//   document.getElementById("name").style.top = topVal + "px";
// };
// document.getElementById("left").onchange = function () {
//   const leftVal = document.getElementById("left").value;
//   document.getElementById("name").style.left = leftVal + "px";
// };
// buat ubah warna text nama
document.addEventListener("DOMContentLoaded", function () {
  const textColor = document.getElementById("text-color-picker");
  const name = document.getElementById("name");
  const fontSize = document.getElementById("font-size");
  const leftVal = document.getElementById("left");
  const topVal = document.getElementById("top");

  textColor.addEventListener("input", function () {
    name.style.color = textColor.value;
  });

  fontSize.addEventListener("input", function () {
    name.style.fontSize = fontSize.value + "px";
  });

  topVal.addEventListener("input", function () {
    name.style.top = topVal.value + "px";
  });
  leftVal.addEventListener("input", function () {
    name.style.left = leftVal.value + "px";
  });
});
window.addEventListener("DOMContentLoaded", function () {
  hardReload();
});
// Buat validasi kalo misal input name kosong, tombol render result akan disable
const input = document.getElementById("names-input");
const renderBtn = document.getElementById("render-button");
const width = document.getElementById("width");
const height = document.getElementById("height");
input.addEventListener("input", function () {
  if (input.value === "") {
    renderBtn.disabled = true;
  } else {
    renderBtn.disabled = false;
  }
});
// Buat clear all value
function hardReload() {
  const inputName = document.getElementById("names-input");
  const width = document.getElementById("width");
  const height = document.getElementById("height");
  const topVal = document.getElementById("top");
  const leftVal = document.getElementById("left");
  const renderBtn = document.getElementById("render-button");
  const style = document.getElementById("font-family");
  const nameColor = document.getElementById("text-color-picker");
  const fontSize = document.getElementById("font-size");
  // const nameRotate = document.getElementById("rotate");

  topVal.value = 0;
  leftVal.value = 0;
  fontSize.value = 69;
  inputName.value = "";
  width.value = "";
  height.value = "";
  renderBtn.disabled = true;
  style.value = "";
  nameColor.value = "#ffffff";
  // nameRotate.value = 0;
}
// Buat upload gambar undangannya
document
  .getElementById("upload-invitation")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.className = "photo";
        img.id = "inv-image";

        const oldImg = document.getElementById("inv-image");
        if (oldImg) {
          document.getElementById("image-preview").removeChild(oldImg);
        }

        document.getElementById("image-preview").appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });

// Buat upload font family
document
  .getElementById("font-family")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const fontData = e.target.result;
        const fontName = file.name.split(".")[0];

        const style = document.createElement("style");
        style.innerHTML = `
                @font-face {
                    font-family: '${fontName}';
                    src: url(${fontData});
                }
                #image-preview p {
                    font-family: '${fontName}';
                }
            `;
        document.head.appendChild(style);
      };
      reader.readAsDataURL(file);
    }
  });
function downloadAllImages() {
  const names = document
    .getElementById("names-input")
    .value.split(",")
    .map((name) => name.trim());
  const zip = new JSZip();
  const downloadButtonAll = document.getElementById("download-all-button");
  const captureElement = document.getElementById("image-preview");
  const width = document.getElementById("width").value;
  const height = document.getElementById("height").value;
  captureElement.style.transform = "scale(1)";
  captureElement.style.width = `${width}px`;
  captureElement.style.height = `${height}px`;
  let promises = [];
  downloadButtonAll.textContent = "Downloading...";
  downloadButtonAll.style.backgroundColor = "#faff70";
  downloadButtonAll.style.color = "#000000";

  names.forEach((name, index) => {
    promises.push(
      new Promise((resolve, reject) => {
        const previewText = document.getElementById("name");
        previewText.textContent = name;
        html2canvas(captureElement, {
          width: width,
          height: height,
        })
          .then((canvas) => {
            canvas.toBlob((blob) => {
              zip.file(`${name}.png`, blob);
              resolve();
            });
          })
          .catch((error) => reject(error));
      })
    );
  });

  Promise.all(promises)
    .then(() => {
      zip.generateAsync({ type: "blob" }).then((content) => {
        setTimeout(() => {
          downloadButtonAll.textContent = "All downloaded";
          downloadButtonAll.style.backgroundColor = "#75ff70";
          downloadButtonAll.style.color = "#000000";
          setTimeout(() => {
            downloadButtonAll.textContent = "Download";
            downloadButtonAll.style.backgroundColor = "#b53df9";
            downloadButtonAll.style.color = "#ffffff";
          }, 3000);
        }, 300);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "images.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        captureElement.style.transform = "scale(0.5)";
      });
    })
    .catch((error) => {
      console.error("Error generating zip file:", error);
    });
}
