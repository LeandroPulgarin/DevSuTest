import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductsService } from '@feature/products/shared/services/products.service';
import { InputComponent } from '@shared/components/forms/Input/Input.component';
import { formatDate } from '@shared/functions/format-date';
import { minDateValidator } from '@shared/functions/min-date-validator';
import { NotificationService } from '@shared/services/notifications/notifications.service';
import { mergeMap, of } from 'rxjs';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  providers: [ProductsService],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductManagementComponent implements OnInit {
  @Input() id!: string;
  public manageForm!: FormGroup;
  public isEdit = signal(false);
  public minDate = signal(formatDate(new Date()));
  private fb = inject(FormBuilder);
  private productsService = inject(ProductsService);
  private notificationService = inject(NotificationService);

  constructor() {
    this.createForm();
  }

  ngOnInit(): void {
    if (this.id) {
      this.getProductById();
      this.isEdit.set(true);
      this.manageForm.controls['id'].disable();
    }
  }

  public submit(): void {
    if (this.isEdit()) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  public resetForm(): void {
    this.manageForm.reset();
  }

  private updateProduct(): void {
    this.productsService
      .putProduct({
        ...this.manageForm.value,
        date_revision: this.manageForm.controls['date_revision'].value,
        id: this.id,
      })
      .subscribe({
        next: () => {
          this.notificationService.showNotification({
            message: 'Producto actualizado correctamente',
            severity: 'success',
          });
        },
      });
  }

  private createProduct(): void {
    this.productsService
      .validateProductId(this.manageForm.controls['id'].value)
      .pipe(
        mergeMap((productExists) => {
          if (productExists) {
            this.notificationService.showNotification({
              message: 'El ID del producto ya existe',
              severity: 'error',
            });
            return of()
          } else {
            return this.productsService.postProduct({
              ...this.manageForm.value,
              date_revision: this.manageForm.controls['date_revision'].value,
            });
          }
        })
      )
      .subscribe({
        next: () => {
          this.notificationService.showNotification({
            message: 'Producto creado correctamente',
            severity: 'success',
          });
          this.resetForm();
        },
      });
  }

  private getProductById(): void {
    this.productsService.getProductById(this.id).subscribe({
      next: (product) => {
        this.manageForm.patchValue(product);
      },
      error: () => {
        this.manageForm.disable();
      },
    });
  }

  private createForm(): void {
    this.manageForm = this.fb.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      date_release: [
        '',
        [Validators.required, minDateValidator(this.minDate())],
      ],
      date_revision: [{ value: '', disabled: true }],
      logo: ['', Validators.required],
    });
    this.listenDateRelease();
  }

  private listenDateRelease(): void {
    this.manageForm.controls['date_release'].valueChanges.subscribe({
      next: (value) => {
        const date = new Date(value);
        date.setHours(0, 0, 0, 0);
        date.setFullYear(date.getFullYear() + 1);
        date.setDate(date.getDate() + 1);
        this.manageForm.controls['date_revision'].setValue(formatDate(date));
      },
    });
  }
}
