import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { ValidatorComponent } from './validator.component';

describe('ValidatorComponent', () => {
  let component: ValidatorComponent;
  let fixture: ComponentFixture<ValidatorComponent>;
  let formGroup: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, ValidatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidatorComponent);
    component = fixture.componentInstance;

    formGroup = new FormGroup({
      testControl: new FormControl(''),
    });

    component.control = formGroup.get('testControl') as FormControl;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize control name on ngOnInit', () => {
    component.ngOnInit();
    expect(component['name']).toBe('testControl');
  });

  it('should return "Campo requerido" for required error', () => {
    const errors = { required: true };
    const errorMessage = component.message(errors);
    expect(errorMessage).toBe('Campo requerido');
  });

  it('should return minlength error message', () => {
    const errors = { minlength: { requiredLength: 5 } };
    const errorMessage = component.message(errors);
    expect(errorMessage).toBe('Debe tener al menos 5 caracteres');
  });

  it('should return maxlength error message', () => {
    const errors = { maxlength: { requiredLength: 10 } };
    const errorMessage = component.message(errors);
    expect(errorMessage).toBe('Debe tener máximo 10 caracteres');
  });

  it('should return minDate error message', () => {
    const errors = { minDate: { value: '2023-01-01' } };
    const errorMessage = component.message(errors);
    expect(errorMessage).toBe('La fecha debe ser mayor o igual a 2023-01-01');
  });

  it('should return empty string for unknown error', () => {
    const errors = { unknown: true };
    const errorMessage = component.message(errors);
    expect(errorMessage).toBe('');
  });

  it('should return control name from getControlName', () => {
    const controlName = component['getControlName']();
    expect(controlName).toBe('testControl');
  });
});
