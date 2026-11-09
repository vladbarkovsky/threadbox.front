import { Component, DestroyRef, Input, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ImagesUploadState } from '../../common/images-upload/images-upload.state';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import type { PostDto } from '../../../../api-client';
import { PostClient } from '../../../../api-client';
import { CreatePostForm } from './create-post.form';
import type { Observable } from 'rxjs';
import { first, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ImagesUploadComponent } from '../../common/images-upload/images-upload.component';
import { TranslatePipe } from '../../common/localization/translate.pipe';
import { TranslationKeys } from '../../common/localization/translation-keys.enum';
import { convertToNSwagClientFileParameter } from '../../common/nswag-operations';
import type { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-create-post-modal',
	templateUrl: './create-post-modal.component.html',
	styleUrls: ['./create-post-modal.component.scss'],
	standalone: true,
	imports: [ReactiveFormsModule, ImagesUploadComponent, TranslatePipe],
	providers: [ImagesUploadState],
})
// TODO: Create non-modal window.
// Possible solution here: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog.
export class CreatePostModalComponent {
	readonly imagesUploadState: ImagesUploadState = inject(ImagesUploadState);
	private readonly ngbActiveModal: NgbActiveModal = inject(NgbActiveModal);
	private readonly postClient: PostClient = inject(PostClient);
	private readonly destroyRef: DestroyRef = inject(DestroyRef);

	@Input() threadId!: string;
	readonly createPostForm: CreatePostForm = new CreatePostForm();
	readonly translationKeys: typeof TranslationKeys = TranslationKeys;

	close(): void {
		this.ngbActiveModal.dismiss();
	}

	onSubmit(): void {
		this.imagesUploadState
			.getFiles()
			.pipe(
				first(),
				switchMap(
					(files: File[]): Observable<PostDto> =>
						this.postClient.create(
							files.map(convertToNSwagClientFileParameter),
							this.createPostForm.text.value,
							this.threadId,
							this.createPostForm.tripcodeString.value
						)
				),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe({
				next: (): void => {
					this.ngbActiveModal.close();
				},
				error: (error: HttpErrorResponse): void => {
					// eslint-disable-next-line no-console
					console.log(error);
				},
			});
	}
}
