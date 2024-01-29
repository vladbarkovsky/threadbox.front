import { Component, DestroyRef, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateBoardModalComponent } from './create-board-modal/create-board-modal.component';
import { UpdateBoardModalComponent } from './update-board-modal/update-board-modal.component';
import { HomePageState } from './home-page.state';
import { ConfirmationModalComponent } from '../common/confirmation-modal/confirmation-modal.component';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ToastService } from '../common/toast/toast.service';
import { BoardsPermissions, SectionsPermissions } from '../../../api-permissions';
import { BoardsClient, SectionsClient } from '../../../api-client';
import { NgxPermissionsModule } from 'ngx-permissions';

@Component({
  selector: 'app-boards-list',
  templateUrl: './boards-list.component.html',
  styleUrls: ['./boards-list.component.scss'],
  standalone: true,
  imports: [RouterLink, AsyncPipe, NgxPermissionsModule],
})
export class BoardsListComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly sectionsClient = inject(SectionsClient);
  private readonly boardsClient = inject(BoardsClient);
  private readonly homePageState = inject(HomePageState);
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
        error: error => console.log(error),
      });
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
        next: () => this.toastService.showSuccessToast('Board deleted'),
        error: () => this.toastService.showErrorToast('Unable to delete board'),
      });
  }
}
