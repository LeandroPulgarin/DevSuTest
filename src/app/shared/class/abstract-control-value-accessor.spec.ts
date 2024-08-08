/* eslint-disable @typescript-eslint/no-explicit-any */
import { AbstractControlValueAccessorComponent } from './abstract-control-value-accessor';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  NgControl,
  Validators,
} from '@angular/forms';
import { Component, Injector } from '@angular/core';

@Component({
  selector: 'app-test-control',
  template: '',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
})
class TestControlComponent extends AbstractControlValueAccessorComponent {}

describe('AbstractControlValueAccessor', () => {
  let component: TestControlComponent;
  let fixture: ComponentFixture<TestControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, TestControlComponent],
      providers: [
        { provide: NgControl, useValue: { control: new FormControl() } },
        Injector,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize control and set disabled state in ngAfterViewInit', () => {
    component.ngAfterViewInit();
    expect(component.control).toBeDefined();
    expect(component.control instanceof FormControl).toBeTrue();
    expect(component.value.disabled).toBeFalse();
    component.onTouch();
    component.onChange('');
  });

  it('should write value and call onChange', () => {
    const spyOnChange = spyOn(component, 'onChange');
    component.writeValue('test value');
    expect(component.value.value).toBe('test value');
    expect(spyOnChange).toHaveBeenCalledWith('test value');
  });

  it('should register onChange function', () => {
    const onChangeFn = () => {};
    component.registerOnChange(onChangeFn);
    expect(component.onChange).toBe(onChangeFn);
  });

  it('should register onTouch function', () => {
    const onTouchFn = () => {};
    component.registerOnTouched(onTouchFn);
    expect(component.onTouch).toBe(onTouchFn);
  });

  it('should call onTouch and hasErrors in onTouched', () => {
    const spyOnTouch = spyOn(component, 'onTouch');
    const spyHasErrors = spyOn(component as any, 'hasErrors');
    component.onTouched();
    expect(spyOnTouch).toHaveBeenCalled();
    expect(spyHasErrors).toHaveBeenCalled();
  });

  it('should disable control if setDisabledState is called with true', () => {
    component.setDisabledState(true);
    expect(component.value.disabled).toBeTrue();
  });

  it('should verify required validator', () => {
    component.control.setValidators(Validators.required);
    component.verifyRequired();
    expect(component.isRequired()).toBeTrue();
  });

  it('should set hasErrorsSignal to true if control is invalid and touched', () => {
    component.control.setErrors({ required: true });
    component.control.markAsTouched();
    (component as any).hasErrors();
    expect(component.hasErrorsSignal()).toBeTrue();
  });

  it('should set hasErrorsSignal to false if control is valid or not touched', () => {
    component.control.setErrors(null);
    component.control.markAsUntouched();
    (component as any).hasErrors();
    expect(component.hasErrorsSignal()).toBeFalse();
  });
});
