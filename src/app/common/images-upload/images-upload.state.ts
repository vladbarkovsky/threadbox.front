import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { BehaviorSubject, map } from 'rxjs';
import type { Base64File } from './base64-file';

@Injectable()
export class ImagesUploadState {
	get base64Files(): Base64File[] {
		return this.base64Files$.value;
	}

	private readonly base64Files$: BehaviorSubject<Base64File[]> = new BehaviorSubject<Base64File[]>([]);

	getBase64Files(): Observable<Base64File[]> {
		return this.base64Files$.asObservable();
	}

	getFiles(): Observable<File[]> {
		return this.base64Files$.pipe(
			map((base64Files: Base64File[]): File[] => base64Files.map((base64File: Base64File): File => base64File.file))
		);
	}

	reset(): void {
		this.base64Files$.next([]);
	}

	addBase64File(base64File: Base64File): void {
		this.base64Files$.next([...this.base64Files$.value, base64File]);
	}

	deleteFile(fileName: string): void {
		this.base64Files$.next(
			this.base64Files$.value.filter((base64File: Base64File): boolean => base64File.file.name !== fileName)
		);
	}
}
