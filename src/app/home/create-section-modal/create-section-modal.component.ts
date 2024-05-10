import { Component, DestroyRef, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SectionsClient } from '../../../../api-client';
import { CreateSectionForm } from './create-section.form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-create-section-modal',
  templateUrl: './create-section-modal.component.html',
  styleUrl: './create-section-modal.component.scss',
  standalone: true,
  imports: [],
})
export class CreateSectionModalComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly sectionsClient = inject(SectionsClient);
  private readonly ngbActiveModal = inject(NgbActiveModal);

  readonly createSectionForm = new CreateSectionForm();

  onSubmit(): void {
    this.sectionsClient
      .createSection(this.createSectionForm.data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.ngbActiveModal.close(),
        error: error => console.log(error),
      });
  }

  cancel(): void {
    this.ngbActiveModal.dismiss();
  }
}
