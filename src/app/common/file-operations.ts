export function downloadFile(blob: Blob, fileName: string): void {
  const anchor = document.createElement('a');
  anchor.download = fileName;
  anchor.href = window.URL.createObjectURL(blob);
  anchor.click();
  URL.revokeObjectURL(anchor.href);
  anchor.remove();
}
