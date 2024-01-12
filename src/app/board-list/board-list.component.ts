import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateBoardModalComponent } from './create-board-modal/create-board-modal.component';
import { UpdateBoardModalComponent } from './update-board-modal/update-board-modal.component';
import { BoardsListFacade } from './boards-list.facade';
import { BoardsListState } from './boards-list.state';
import { first } from 'rxjs/operators';
import { ConfirmationModalComponent } from '../common/confirmation-modal/confirmation-modal.component';
import { ToastService } from '../common/toast/toast.service';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-boards-list',
  templateUrl: './boards-list.component.html',
  styleUrls: ['./boards-list.component.scss'],
  standalone: true,
  imports: [RouterLink, AsyncPipe],
})
export class BoardListComponent {
  boards$ = this.boardListState.getBoards();

  constructor(
    private boardsListFacade: BoardsListFacade,
    private boardListState: BoardsListState,
    private modal: NgbModal,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.boardsListFacade.getBoards();
  }

  openCreateBoardModal(): void {
    this.modal.open(CreateBoardModalComponent, { backdrop: 'static', keyboard: false, scrollable: true, size: 'lg' });
  }

  openUpdateBoardModal(boardId: string) {
    this.boardsListFacade.getBoard(boardId, boardDto => {
      const modal = this.modal.open(UpdateBoardModalComponent, {
        backdrop: 'static',
        keyboard: false,
        scrollable: true,
        size: 'lg',
      });

      modal.componentInstance.boardDto = boardDto;
    });
  }

  openDeleteConfirmationModule(boardId: string) {
    const modal = this.modal.open(ConfirmationModalComponent, { backdrop: 'static', keyboard: false, scrollable: true });
    modal.closed.pipe(first()).subscribe(() => this.boardsListFacade.deleteBoard(boardId));
  }
}
