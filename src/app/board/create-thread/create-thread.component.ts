import { Component, DestroyRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import type { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ImagesUploadComponent } from '../../common/images-upload/images-upload.component';
import { CreateThreadForm } from './create-thread.form';
import type { FileResponse } from '../../../../api-client';
import { ThreadsClient } from '../../../../api-client';
import { ImagesUploadState } from '../../common/images-upload/images-upload.state';
import { ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { first, switchMap, type Observable } from 'rxjs';
import { TranslatePipe } from '../../common/localization/translate.pipe';
import { TranslationKey } from '../../common/localization/translation-key.enum';
import type { Message } from '../../common/message/message';
import { MessageComponent } from '../../common/message/message.component';
import { MessageStatus } from '../../common/message/message-status';
import { convertToNSwagFileParameter, getResponseBody } from '../../common/nswag-operations';
import type { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-create-thread',
	templateUrl: './create-thread.component.html',
	styleUrls: ['./create-thread.component.scss'],
	standalone: true,
	imports: [NgbCollapseModule, ImagesUploadComponent, ReactiveFormsModule, TranslatePipe, MessageComponent],
	providers: [ImagesUploadState],
})
export class CreateThreadComponent {
	readonly imagesUploadState = inject(ImagesUploadState);
	private readonly threadsClient = inject(ThreadsClient);
	private readonly destroyRef = inject(DestroyRef);

	@Input() boardId!: string;
	@Output() readonly threadCreated: EventEmitter<void> = new EventEmitter<void>();
	@ViewChild('collapse') ngbCollapse!: NgbCollapse;

	message: Message | undefined = undefined;

	formCollapsed = true;
	createThreadForm = new CreateThreadForm();
	readonly translationKey = TranslationKey;

	toggleCollapse(): void {
		this.ngbCollapse.toggle();

		if (this.formCollapsed) {
			this.reset();
		}
	}

	onSubmit(): void {
		this.message = undefined;

		this.imagesUploadState
			.getFiles()
			.pipe(
				first(),
				switchMap(
					(files): Observable<FileResponse> =>
						this.threadsClient.createThread(
							this.createThreadForm.title.value,
							this.createThreadForm.text.value,
							this.boardId,
							this.createThreadForm.tripcodeString.value,
							files.map(convertToNSwagFileParameter)
						)
				),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe({
				next: (): void => {
					this.ngbCollapse.toggle(false);
					this.reset();
					this.threadCreated.emit();
				},
				error: (error: HttpErrorResponse): void => {
					this.message = { text: getResponseBody(error), status: MessageStatus.Error };
				},
			});
	}

	/**
	 * Resets form and attached images.
	 *
	 * @private
	 * @memberof CreateThreadComponent
	 */
	private reset(): void {
		this.createThreadForm.reset();
		this.imagesUploadState.reset();
	}
}
