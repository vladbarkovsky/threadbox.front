import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Base64File } from './base64-file';

@Injectable()
export class ImagesUploadState {
  get base64Files(): Base64File[] {
    return this.base64Files$.value;
  }

  private readonly base64Files$ = new BehaviorSubject<Base64File[]>([]);

  getBase64Files(): Observable<Base64File[]> {
    return this.base64Files$.asObservable();
  }

  getFiles(): Observable<File[]> {
    return this.base64Files$.pipe(map(x => x.map(x => x.file)));
  }

  reset(): void {
    this.base64Files$.next([]);
  }

  addBase64File(base64File: Base64File): void {
    this.base64Files$.next([...this.base64Files$.value, base64File]);
  }

  deleteFile(fileName: string): void {
    this.base64Files$.next(this.base64Files$.value.filter(x => x.file.name !== fileName));
  }
}
