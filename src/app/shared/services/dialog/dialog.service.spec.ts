import { TestBed } from '@angular/core/testing';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { DialogService } from './dialog.service';
import { DialogRef } from './dialog-ref';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { PortalModule } from '@angular/cdk/portal';
import { of } from 'rxjs';

describe('DialogService', () => {
  let dialogService: DialogService;
  let overlay: Overlay;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule, PortalModule],
      providers: [DialogService, Overlay],
    });

    dialogService = TestBed.inject(DialogService);
    overlay = TestBed.inject(Overlay);
  });

  it('should be created', () => {
    expect(dialogService).toBeTruthy();
  });

  it('should open a dialog', () => {
    const overlaySpy = spyOn(overlay, 'create').and.callThrough();
    const dialogRef = dialogService.openDialog(ConfirmDialogComponent);

    expect(overlaySpy).toHaveBeenCalled();
    expect(dialogRef).toBeTruthy();
  });

  it('should close the dialog on backdrop click', () => {
    const overlayRef = overlay.create();
    const dialogRef = new DialogRef(overlayRef);
    spyOn(overlayRef, 'backdropClick').and.returnValue(of(null as unknown as MouseEvent));
    spyOn(dialogRef, 'close').and.callThrough();

    dialogService['setupBackdropClickClose'](dialogRef, overlayRef);

    overlayRef.backdropClick().subscribe();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should create a confirm dialog', () => {
    const dialogRef = dialogService.confirmDialog();
    expect(dialogRef).toBeTruthy();
  });
});
