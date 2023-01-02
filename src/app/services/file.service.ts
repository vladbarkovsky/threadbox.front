import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FileService {
  downloadFile(blob: Blob, fileName: string = 'ThreadboxFile'): void {
    const a = document.createElement('a');
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    a.click();
    a.remove();
  }
}
