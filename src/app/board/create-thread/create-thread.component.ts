import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ImagesUploadComponent } from '../../common/images-upload/images-upload.component';
import { CreateThreadForm } from './create-thread.form';
import { ThreadsClient } from '../../../../api-client';

@Component({
  selector: 'app-create-thread',
  templateUrl: './create-thread.component.html',
  styleUrl: './create-thread.component.scss',
  standalone: true,
  imports: [NgbCollapseModule, ImagesUploadComponent],
})
export class CreateThreadComponent implements OnInit {
  private readonly threadsClient = inject(ThreadsClient);
  private readonly destroyRef = inject(DestroyRef);

  @Input() boardId!: string;

  formCollapsed: boolean = true;
  createThreadForm: CreateThreadForm | undefined;

  ngOnInit(): void {
    this.createThreadForm = new CreateThreadForm(this.boardId);
  }
}
