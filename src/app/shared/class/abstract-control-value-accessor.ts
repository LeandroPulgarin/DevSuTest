import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Injector,
  Input,
  inject,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  template: '',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class AbstractControlValueAccessorComponent
  implements ControlValueAccessor, AfterViewInit
{
  @Input() disabled: boolean = false;
  @Input() placeholder!: string;
  @Input() label!: string;
  @Input({ required: true }) inputId!: string;
  value = new FormControl('');
  public name!: string;
  public control!: FormControl;
  public hasErrorsSignal = signal(false);
  public isRequired = signal(false);
  private injector = inject(Injector);

  onChange: (value: string | null) => void = () => {
  };
  onTouch: () => void = () => {
  };

  ngAfterViewInit(): void {
    const ngControl: NgControl | null = this.injector.get(NgControl, null);
    if (ngControl) {
      this.control = ngControl.control as FormControl;
      this.setDisabledState(!!ngControl?.control?.disabled);
      this.verifyRequired();
    }
  }

  writeValue(value: string): void {
    this.value.setValue(value);
    this.onChange(value);
    this.hasErrors();
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
    this.hasErrors();
  }

  onTouched(): void {
    this.onTouch();
    this.hasErrors();
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.disabled || isDisabled) this.value.disable();
  }

  public verifyRequired(): void {
    if (this.control.hasValidator(Validators.required)) {
      this.isRequired.set(true);
    }
  }

  private hasErrors(): void {
    this.hasErrorsSignal.set(this.control?.invalid && this.control?.touched);
  }
}
