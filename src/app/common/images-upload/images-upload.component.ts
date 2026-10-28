import { Component, Input, inject } from '@angular/core';
import { ToastService } from '../toast/toast.service';
import { ReactiveFormsModule } from '@angular/forms';
import type { Base64File } from './base64-file';
import type { Observable } from 'rxjs';
import type { ImagesUploadState } from './images-upload.state';
import { AsyncPipe } from '@angular/common';
import { ToastStatus } from '../toast/toast-status';
import { TranslatePipe } from '../localization/translate.pipe';
import { TranslationKey } from '../localization/translation-key.enum';

@Component({
	selector: 'app-images-upload',
	templateUrl: './images-upload.component.html',
	styleUrls: ['./images-upload.component.scss'],
	standalone: true,
	imports: [ReactiveFormsModule, AsyncPipe, TranslatePipe],
})
export class ImagesUploadComponent {
	private readonly toastService = inject(ToastService);

	@Input() imagesUploadState!: ImagesUploadState;
	@Input() maxCount!: number;

	/**
	 * Required for multiple component instances.
	 * Must be unique for each component instance.
	 *
	 * @type {string}
	 * @memberof ImagesUploadComponent
	 */
	@Input() fileInputId!: string;
	readonly translationKey = TranslationKey;

	get base64Files$(): Observable<Base64File[]> {
		return this.imagesUploadState.getBase64Files();
	}

	readonly allowedFormats: string[] = ['image/jpeg', 'image/gif', 'image/png', 'image/bmp', 'image/svg+xml'];

	onFileInputChange($event: Event): void {
		const fileInput = $event.target as HTMLInputElement;
		let files = Array.from(fileInput.files!);

		// Clearing file input.
		fileInput.value = '';

		files.forEach((file, i): void => {
			if (this.imagesUploadState.base64Files.find((x): boolean => x.file.name === file.name)) {
				files.splice(i, 1);

				this.toastService.showToast({
					translationKey: TranslationKey.Common_ImagesUpload_FileAlreadyAdded,
					interpolationParameters: [file.name],
					status: ToastStatus.Warning,
				});
			}

			if (!this.allowedFormats.includes(file.type)) {
				files.splice(i, 1);

				this.toastService.showToast({
					translationKey: TranslationKey.Common_ImagesUpload_FileNotSupported,
					interpolationParameters: [file.name],
					status: ToastStatus.Warning,
				});
			}
		});

		if (this.imagesUploadState.base64Files.length + files.length > this.maxCount) {
			files = files.slice(0, this.maxCount - this.imagesUploadState.base64Files.length);
			this.toastService.showToast({
				translationKey: TranslationKey.Common_ImagesUpload_MaxCount,
				interpolationParameters: [this.maxCount],
				status: ToastStatus.Warning,
			});
		}

		if (files.length) {
			files.forEach((file): void => {
				// We create reader for each uploaded image to get it's Base64 representation,
				// Because we want to show uploaded images in HTML.
				const reader = new FileReader();

				reader.onload = (event): void => {
					const base64 = event.target!.result as string;
					this.imagesUploadState.addBase64File({ file, base64 });
				};

				reader.readAsDataURL(file);
			});
		}
	}

	deleteFile(fileName: string): void {
		this.imagesUploadState.deleteFile(fileName);
	}

	deleteFiles(): void {
		this.imagesUploadState.reset();
	}
}
