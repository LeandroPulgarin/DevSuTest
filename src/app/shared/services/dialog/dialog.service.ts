import { Injectable, Injector, inject } from '@angular/core';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { DialogRef } from './dialog-ref';
import { DIALOG_DATA } from './dialog-tokens';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

interface DialogConfig {
  data?: unknown;
}

@Injectable()
export class DialogService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);

  public openDialog<T>(
    component: ComponentType<T>,
    config?: DialogConfig
  ): DialogRef {
    const overlayRef = this.createOverlay();
    const dialogRef = this.createDialogRef(overlayRef);
    const injector = this.createInjector(config, dialogRef);

    this.attachDialogContainer<T>(component, overlayRef, injector);
    this.setupBackdropClickClose(dialogRef, overlayRef);

    return dialogRef;
  }

  public confirmDialog(config?: DialogConfig): DialogRef {
    return this.openDialog(ConfirmDialogComponent, config);
  }

  private createOverlay(): OverlayRef {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    return this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      panelClass: 'cdk-overlay-pane',
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
    });
  }

  private createDialogRef(overlayRef: OverlayRef): DialogRef {
    return new DialogRef(overlayRef);
  }

  private createInjector(
    config: DialogConfig | undefined,
    dialogRef: DialogRef
  ): Injector {
    const providers = [
      { provide: DialogRef, useValue: dialogRef },
      { provide: DIALOG_DATA, useValue: config?.data },
    ];

    return Injector.create({
      parent: this.injector,
      providers,
    });
  }

  private attachDialogContainer<T>(
    component: ComponentType<T>,
    overlayRef: OverlayRef,
    injector: Injector
  ): void {
    const portal = new ComponentPortal(component, null, injector);
    overlayRef.attach(portal);
  }

  private setupBackdropClickClose(
    dialogRef: DialogRef,
    overlayRef: OverlayRef
  ): void {
    overlayRef.backdropClick().subscribe({
      next: () => {
        dialogRef.close();
      },
    });
  }
}
