import type { OnInit } from '@angular/core';
import { Component, DestroyRef, inject } from '@angular/core';
import type { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateBoardModalComponent } from './create-board-modal/create-board-modal.component';
import { UpdateBoardModalComponent } from './update-board-modal/update-board-modal.component';
import { HomeState } from './home.state';
import { ConfirmationModalComponent } from '../common/confirmation-modal/confirmation-modal.component';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Observable } from 'rxjs';
import { switchMap } from 'rxjs';
import { ToastService } from '../common/toast/toast.service';
import { BoardPermissions, SectionPermissions } from '../../../api-permissions';
import type { ApiException, BoardDto, FileResponse, SectionBoardDto, SectionListDto } from '../../../api-client';
import { BoardClient, DeleteBoardCommand, SectionClient } from '../../../api-client';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CreateSectionModalComponent } from './create-section-modal/create-section-modal.component';
import { ToastStatus } from '../common/toast/toast-status';
import { TranslatePipe } from '../common/localization/translate.pipe';
import { TranslationKeys } from '../common/localization/translation-keys.enum';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	standalone: true,
	imports: [RouterLink, AsyncPipe, NgxPermissionsModule, TranslatePipe],
})
export class HomeComponent implements OnInit {
	private readonly destroyRef: DestroyRef = inject(DestroyRef);
	private readonly sectionClient: SectionClient = inject(SectionClient);
	private readonly boardClient: BoardClient = inject(BoardClient);
	private readonly homePageState: HomeState = inject(HomeState);
	private readonly ngbModal: NgbModal = inject(NgbModal);
	private readonly toastService: ToastService = inject(ToastService);

	sectionsPermissions: typeof SectionPermissions = SectionPermissions;
	boardsPermissions: typeof BoardPermissions = BoardPermissions;
	readonly translationKey: typeof TranslationKeys = TranslationKeys;

	sections$: Observable<SectionListDto[] | undefined> = this.homePageState.getSections();

	ngOnInit(): void {
		this.sectionClient
			.getList()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (sections: SectionListDto[]): void => {
					this.homePageState.setSections(sections);
				},
				// TODO: Set error in sign in state (error must be displayed in component)
				error: (error: ApiException): void => {
					// eslint-disable-next-line no-console
					console.error(error.response);
				},
			});
	}

	openCreateSectionModal(): void {
		this.ngbModal.open(CreateSectionModalComponent, { backdrop: 'static', keyboard: false, scrollable: true, size: 'lg' });
	}

	openCreateBoardModal(sectionId: string): void {
		const modal: NgbModalRef = this.ngbModal.open(CreateBoardModalComponent, {
			backdrop: 'static',
			keyboard: false,
			scrollable: true,
			size: 'lg',
		});

		const component: CreateBoardModalComponent = modal.componentInstance as CreateBoardModalComponent;
		component.sectionId = sectionId;
	}

	openUpdateBoardModal(boardId: string): void {
		this.boardClient
			.get(boardId)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (boardDto: BoardDto): void => {
					const modal: NgbModalRef = this.ngbModal.open(UpdateBoardModalComponent, {
						backdrop: 'static',
						keyboard: false,
						scrollable: true,
						size: 'lg',
					});

					modal.componentInstance.boardDto = boardDto;
				},
			});
	}

	openDeleteBoardConfirmationModal(board: SectionBoardDto): void {
		const modal: NgbModalRef = this.ngbModal.open(ConfirmationModalComponent, {
			backdrop: 'static',
			keyboard: false,
			scrollable: true,
		});

		modal.componentInstance.text = TranslationKeys.Home_DeleteBoard;

		modal.closed
			.pipe(
				switchMap(
					(): Observable<FileResponse> =>
						this.boardClient.delete(
							board.id,
							new DeleteBoardCommand({
								id: board.id,
								rowVersion: board.rowVersion,
							})
						)
				),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe({
				next: (): void => {
					this.toastService.showToast({ translationKey: TranslationKeys.Home_BoardDeleted, status: ToastStatus.Success });
				},
				error: (): void => {
					this.toastService.showToast({ translationKey: TranslationKeys.Home_UnableToDeleteBoard, status: ToastStatus.Error });
				},
			});
	}
}
