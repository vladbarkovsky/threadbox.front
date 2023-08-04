import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BoardsClient } from 'api-client';
import { takeUntil } from 'rxjs/operators';
import { MemoryLeaksProtectedComponent } from 'src/app/common/components/memory-leaks-protected.component';
import {
  ConfirmationModalComponent,
  ConfirmationModalConfig,
} from 'src/app/common/components/confirmation-modal/confirmation-modal.component';
import { EventService } from 'src/app/services/event.service';
import { ToastService } from 'src/app/services/toast.service';
import { AddBoardModalComponent } from './add-board-modal/add-board-modal.component';
import { EditBoardModalComponent } from './edit-board-modal/edit-board-modal.component';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss'],
})
export class BoardListComponent extends MemoryLeaksProtectedComponent implements OnInit {
  constructor(
    private boardsClient: BoardsClient,
    private toastService: ToastService,
    private modal: NgbModal,
    private eventService: EventService
  ) {
    super();
  }

  ngOnInit(): void {}

  openAddBoardModal(): void {
    this.modal.open(AddBoardModalComponent, { backdrop: 'static', keyboard: false, scrollable: true, size: 'lg' });
  }

  openEditBoardModal(boardId: string): void {
    this.boardsClient
      .getBoard(boardId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: x => {
          const modalRef = this.modal.open(EditBoardModalComponent, {
            backdrop: 'static',
            keyboard: false,
            scrollable: true,
            size: 'lg',
          });
          modalRef.componentInstance.boardDto = x;
        },
        error: () => {
          this.toastService.error('Unable to load board for editing.');
        },
      });
  }
}
