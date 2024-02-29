import { FileParameter } from '../../../api-client';

export function convertToNSwagFileParameter(file: File) {
  return <FileParameter>{
    data: file,
    fileName: file.name,
  };
}

export function downloadFile(blob: Blob, fileName: string): void {
  const a = document.createElement('a');
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  a.click();
  a.remove();
}
