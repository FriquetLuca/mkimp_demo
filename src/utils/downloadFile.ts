export function downloadFile(
  fileName: string,
  fileContent: BlobPart[],
  contentType = 'text/text'
) {
  const blob = new Blob(fileContent, { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
