import { Component, DestroyRef, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateBoardModalComponent } from './create-board-modal/create-board-modal.component';
import { UpdateBoardModalComponent } from './update-board-modal/update-board-modal.component';
import { BoardsListFacade } from './boards-list.facade';
import { BoardsListState } from './boards-list.state';
import { ConfirmationModalComponent } from '../common/confirmation-modal/confirmation-modal.component';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ToastService } from '../common/toast/toast.service';
import { BoardsPermissions } from '../../../api-permissions';

@Component({
  selector: 'app-boards-list',
  templateUrl: './boards-list.component.html',
  styleUrls: ['./boards-list.component.scss'],
  standalone: true,
  imports: [RouterLink, AsyncPipe],
})
export class BoardsListComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly boardsListFacade = inject(BoardsListFacade);
  private readonly boardsListState = inject(BoardsListState);
  private readonly ngbModal = inject(NgbModal);
  private readonly toastService = inject(ToastService);

  boardsPermissions = BoardsPermissions;

  boards$ = this.boardsListState.getBoards();

  ngOnInit(): void {
    this.boardsListFacade
      .getBoards()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: boards => this.boardsListState.setBoards(boards),
        // TODO: Set error in sign in state (error must be displayed in component)
        error: error => console.log(error),
      });
  }

  openCreateBoardModal(): void {
    this.ngbModal.open(CreateBoardModalComponent, { backdrop: 'static', keyboard: false, scrollable: true, size: 'lg' });
  }

  openUpdateBoardModal(boardId: string): void {
    this.boardsListFacade
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
        switchMap(() => this.boardsListFacade.deleteBoard(boardId)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => this.toastService.showSuccessToast('Board deleted'),
        error: () => this.toastService.showErrorToast('Unable to delete board'),
      });
  }
}
