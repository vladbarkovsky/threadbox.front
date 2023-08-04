import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ThreadsClient, BoardsClient, BoardDto } from 'api-client';
import { takeUntil } from 'rxjs/operators';
import { MemoryLeaksProtectedComponent } from 'src/app/common/memory-leaks-protected.component';
import { EventService } from 'src/app/services/event.service';
import { FileService } from 'src/app/common/file.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { AddThreadModalComponent } from './add-thread-modal/add-thread-modal.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent extends MemoryLeaksProtectedComponent implements OnInit {
  boardId: string = this.activatedRoute.snapshot.params.boardId;
  board?: BoardDto;

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private boardsClient: BoardsClient,
    private modal: NgbModal
  ) {
    super();
  }

  ngOnInit(): void {
    this.boardsClient
      .getBoard(this.boardId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: x => (this.board = x),
        error: () => this.toastService.showErrorToast('Unable to load board data.'),
      });
  }

  openAddThreadModal(): void {
    this.modal.open(AddThreadModalComponent, { backdrop: 'static', keyboard: false, scrollable: true, size: 'xl' });
  }
}
