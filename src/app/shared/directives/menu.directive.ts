/* eslint-disable @typescript-eslint/no-explicit-any */
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[appMenu]',
  standalone: true,
})
export class MenuDirective {
  @Input() menuOverlay!: TemplateRef<any>;

  private overlayRef!: OverlayRef;
  private overlay = inject(Overlay);
  private elementRef = inject(ElementRef);
  private containerRef = inject(ViewContainerRef);

  @HostListener('click')
  openMenu(): void {
    this.overlayRef = this.overlay.create({
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.elementRef)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
        ]),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: 'menu-panel',
    });

    const portalRef = new TemplatePortal(this.menuOverlay, this.containerRef);

    const menuOverlayRef = this.overlayRef.attach(portalRef);

    this.overlayRef.backdropClick().subscribe({
      next: () => {
        this.overlayRef.dispose();
      },
    });

    menuOverlayRef.rootNodes.forEach((node) => {
      node.addEventListener('click', () => {
        this.overlayRef.dispose();
      });
    });
  }
}
