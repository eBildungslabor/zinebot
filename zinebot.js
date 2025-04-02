document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("zineForm");
  form.addEventListener("submit", handleSubmit);
});

async function handleSubmit(event) {
  event.preventDefault();

  const files = [];
  for (let i = 1; i <= 8; i++) {
    const input = document.getElementById(`image${i}`);
    if (input.files.length === 0) {
      alert(`Bild ${i} fehlt!`);
      return;
    }
    files.push(input.files[0]);
  }

  const images = await Promise.all(files.map(readImage));

  const { PDFDocument, degrees } = window.pdfLib;

  const printPdfBytes = await createPrintPDF(images, PDFDocument, degrees);
  const viewPdfBytes = await createReadingPDF(images, PDFDocument);

  const printBlob = new Blob([printPdfBytes], { type: "application/pdf" });
  const viewBlob = new Blob([viewPdfBytes], { type: "application/pdf" });

  localStorage.setItem("printPdfUrl", URL.createObjectURL(printBlob));
  localStorage.setItem("viewPdfUrl", URL.createObjectURL(viewBlob));

  window.location.href = "output.html";
}

function readImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
