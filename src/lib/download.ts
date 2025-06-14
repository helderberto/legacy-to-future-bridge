
export function downloadFile(
  content: string,
  fileName: string,
  mimeType: string
) {
  if (!content) {
    console.error("No content to download.");
    return;
  }
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
