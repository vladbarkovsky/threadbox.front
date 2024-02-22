import { Component, DestroyRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { NgbCollapse, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ImagesUploadComponent } from '../../common/images-upload/images-upload.component';
import { CreateThreadForm } from './create-thread.form';
import { ThreadsClient } from '../../../../api-client';
import { Subject } from 'rxjs';

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

  @ViewChild('collapse') ngbCollapse!: NgbCollapse;
  @Input() boardId!: string;
  readonly files$ = new Subject<File[]>();

  formCollapsed = true;
  createThreadForm = new CreateThreadForm();

  ngOnInit(): void {}

  toggleCollapse(): void {
    this.ngbCollapse.toggle();

    if (this.formCollapsed) {
      this.files$.next([]);
    }
  }
}
