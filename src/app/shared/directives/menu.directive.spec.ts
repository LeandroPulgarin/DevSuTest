/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MenuDirective } from './menu.directive';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <ng-template #menuTemplate>
      <div class="menu-item">Menu Item</div>
    </ng-template>
    <button appMenu [menuOverlay]="menuTemplate">Open Menu</button>
  `,
  standalone: true,
  imports: [OverlayModule, PortalModule, MenuDirective],
})
class TestComponent {
  @ViewChild(MenuDirective) menuDirective!: MenuDirective;
  @ViewChild('menuTemplate') menuTemplate!: TemplateRef<any>;
}

describe('MenuDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayModule, PortalModule, TestComponent, MenuDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component.menuDirective).toBeTruthy();
  });

  it('should open menu on click', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);

    fixture.detectChanges();

    const overlayContainer = document.querySelector('.cdk-overlay-container');
    expect(overlayContainer).toBeTruthy();
    expect(overlayContainer!.querySelector('.menu-item')).toBeTruthy();
  });

  it('should close menu on backdrop click', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);

    fixture.detectChanges();

    const backdrop = document.querySelector('.cdk-overlay-backdrop');
    backdrop!.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    const overlayContainer = document.querySelector('.cdk-overlay-container');
    expect(overlayContainer!.querySelector('.menu-item')).toBeFalsy();
  });

  it('should close menu on menu item click', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);

    fixture.detectChanges();

    const menuItem = document.querySelector('.menu-item');
    menuItem!.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    const overlayContainer = document.querySelector('.cdk-overlay-container');
    expect(overlayContainer!.querySelector('.menu-item')).toBeFalsy();
  });
});
