import { Component, DestroyRef, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateBoardModalComponent } from './create-board-modal/create-board-modal.component';
import { UpdateBoardModalComponent } from './update-board-modal/update-board-modal.component';
import { HomeState } from './home.state';
import { ConfirmationModalComponent } from '../common/confirmation-modal/confirmation-modal.component';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ToastService } from '../common/toast/toast.service';
import { BoardsPermissions, SectionsPermissions } from '../../../api-permissions';
import { BoardsClient, SectionsClient, SwaggerException } from '../../../api-client';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CreateSectionModalComponent } from './create-section-modal/create-section-modal.component';
import { ToastStatus } from '../common/toast/toast-status';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [RouterLink, AsyncPipe, NgxPermissionsModule],
})
export class HomeComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly sectionsClient = inject(SectionsClient);
  private readonly boardsClient = inject(BoardsClient);
  private readonly homePageState = inject(HomeState);
  private readonly ngbModal = inject(NgbModal);
  private readonly toastService = inject(ToastService);

  sectionsPermissions = SectionsPermissions;
  boardsPermissions = BoardsPermissions;

  sections$ = this.homePageState.getSections();

  ngOnInit(): void {
    this.sectionsClient
      .getSections()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: sections => this.homePageState.setSections(sections),
        // TODO: Set error in sign in state (error must be displayed in component)
        error: (error: SwaggerException) => console.error(error.response),
      });
  }

  openCreateSectionModal(): void {
    this.ngbModal.open(CreateSectionModalComponent, { backdrop: 'static', keyboard: false, scrollable: true, size: 'lg' });
  }

  openCreateBoardModal(): void {
    this.ngbModal.open(CreateBoardModalComponent, { backdrop: 'static', keyboard: false, scrollable: true, size: 'lg' });
  }

  openUpdateBoardModal(boardId: string): void {
    this.boardsClient
      .getBoard(boardId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: boardDto => {
          const modal = this.ngbModal.open(UpdateBoardModalComponent, {
            backdrop: 'static',
            keyboard: false,
            scrollable: true,
            size: 'lg',
          });

          modal.componentInstance.boardDto = boardDto;
        },
      });
  }

  openDeleteConfirmationModal(boardId: string): void {
    const modal = this.ngbModal.open(ConfirmationModalComponent, { backdrop: 'static', keyboard: false, scrollable: true });

    modal.closed
      .pipe(
        switchMap(() => this.boardsClient.deleteBoard(boardId)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => this.toastService.showToast({ text: 'Board deleted', status: ToastStatus.Success }),
        error: () => this.toastService.showToast({ text: 'Unable to delete board', status: ToastStatus.Error }),
      });
  }
}
