import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Input, signal, WritableSignal } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { AbstractControlValueAccessorComponent } from '@shared/class/abstract-control-value-accessor';
import { ValidatorComponent } from '../validator/validator.component';

const text = 'text';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ValidatorComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  templateUrl: './Input.component.html',
  styleUrl: './Input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent extends AbstractControlValueAccessorComponent {
  @Input() type: string = text;
  @Input() minDate: WritableSignal<string> = signal('');
}
