import { FileParameter } from '../../../api-client';

export function convertToNSwagFileParameter(file: File) {
  return <FileParameter>{
    data: file,
    fileName: file.name,
  };
}

export function downloadFile(blob: Blob, fileName: string): void {
  const anchor = document.createElement('a');
  anchor.download = fileName;
  anchor.href = window.URL.createObjectURL(blob);
  anchor.click();
  URL.revokeObjectURL(anchor.href);
  anchor.remove();
}
