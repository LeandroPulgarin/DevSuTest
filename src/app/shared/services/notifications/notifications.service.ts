import { Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationComponent } from '@shared/components/notification/notification.component';

export interface NotificationConfig {
  message: string;
  severity?: 'info' | 'success' | 'warning' | 'error' | undefined;
  duration?: number;
}

@Injectable()
export class NotificationService {
  private readonly destroy$ = new Subject<void>();
  private overlayRef: OverlayRef | null = null;

  constructor(private overlay: Overlay) {}

  public showNotification(config: NotificationConfig): void {
    this.closeNotification();

    const positionStrategy = this.overlay
      .position()
      .global()
      .bottom('20px')
      .centerHorizontally();
    this.overlayRef = this.overlay.create({
      panelClass: 'cdk-overlay-pane-notification',
      hasBackdrop: false,
      positionStrategy,
    });

    const notificationPortal = new ComponentPortal(NotificationComponent);
    const componentRef = this.overlayRef.attach(notificationPortal);
    componentRef.instance.message = config.message;
    componentRef.instance.severity = config.severity;

    timer(config.duration || 5000)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.closeNotification();
        },
      });
  }

  private closeNotification(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
