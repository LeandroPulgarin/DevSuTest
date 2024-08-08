import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-validator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.scss'],
})
export class ValidatorComponent implements OnInit {
  @Input() public control!: FormControl;

  public hasError = signal(false);
  private name = '';

  constructor() {}

  ngOnInit(): void {
    const fieldName: string = this.getControlName();
    this.name = fieldName;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public message(errors: any): string {
    if (errors?.required) return 'Campo requerido';
    if (errors?.minlength)
      return `Debe tener al menos ${errors.minlength.requiredLength} caracteres`;
    if (errors?.maxlength)
      return `Debe tener máximo ${errors.maxlength.requiredLength} caracteres`;
    if (errors?.minDate)
      return `La fecha debe ser mayor o igual a ${errors.minDate.value}`;
    return '';
  }

  private getControlName(): string {
    let controlName = '';
    const parent = this.control['parent'];

    if (parent instanceof FormGroup) {
      for (const name in parent.controls) {
        if (this.control === parent.controls[name]) {
          controlName = name;
        }
      }
    }

    return controlName;
  }
}
