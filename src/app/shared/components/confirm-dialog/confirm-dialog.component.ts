import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogRef } from '@shared/services/dialog/dialog-ref';
import { DIALOG_DATA } from '@shared/services/dialog/dialog-tokens';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  private dialogRef = inject(DialogRef);
  private dialogData = inject(DIALOG_DATA);
  public readonly message = this.dialogData?.message;

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onConfirm(): void {
    this.dialogRef.close(true);
  }
}
