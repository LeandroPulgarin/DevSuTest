/* eslint-disable @typescript-eslint/no-explicit-any */
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import {
  NotificationConfig,
  NotificationService,
} from './notifications.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let overlay: Overlay;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule],
      providers: [NotificationService, Overlay],
    });

    service = TestBed.inject(NotificationService);
    overlay = TestBed.inject(Overlay);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show a notification', () => {
    const config: NotificationConfig = {
      message: 'Test message',
      severity: 'success',
      duration: 3000,
    };
    spyOn(service as any, 'closeNotification').and.callThrough();
    spyOn(overlay, 'create').and.callThrough();

    service.showNotification(config);

    expect((service as any).closeNotification).toHaveBeenCalled();
    expect(overlay.create).toHaveBeenCalled();
    expect((service as any).overlayRef).toBeTruthy();
  });

  it('should close the notification after the specified duration', fakeAsync(() => {
    const config: NotificationConfig = {
      message: 'Test message',
      severity: 'success',
      duration: 1000,
    };
    spyOn(service as any, 'closeNotification').and.callThrough();

    service.showNotification(config);
    tick(1200);
    expect((service as any).closeNotification).toHaveBeenCalled();
    expect((service as any).overlayRef).toBeNull();
  }));

  it('should close the existing notification before showing a new one', () => {
    const config1: NotificationConfig = {
      message: 'First message',
      severity: 'info',
      duration: 5000,
    };
    const config2: NotificationConfig = {
      message: 'Second message',
      severity: 'error',
      duration: 5000,
    };
    spyOn(service as any, 'closeNotification').and.callThrough();

    service.showNotification(config1);
    service.showNotification(config2);

    expect((service as any).closeNotification).toHaveBeenCalledTimes(2);
    expect((service as any).overlayRef).toBeTruthy();
  });

  it('should close the notification immediately when closeNotification is called', () => {
    const config: NotificationConfig = {
      message: 'Test message',
      severity: 'success',
      duration: 5000,
    };
    service.showNotification(config);

    service['closeNotification']();

    expect((service as any).overlayRef).toBeNull();
  });

  it('should close the notification after default duration', fakeAsync(() => {
    const config: NotificationConfig = {
      message: 'Test message',
      severity: 'success',
    };
    spyOn(service as any, 'closeNotification').and.callThrough();

    service.showNotification(config);
    tick(5500);
    expect((service as any).closeNotification).toHaveBeenCalled();
    expect((service as any).overlayRef).toBeNull();
  }));
});
