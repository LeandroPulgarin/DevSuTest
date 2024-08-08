import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import productsColumns from '@feature/products/shared/const/products-columns';
import { Product } from '@feature/products/shared/interfaces/product.interface';
import { FilterProductsPipe } from '@feature/products/shared/pipes/products-filter.pipe';
import { ProductsService } from '@feature/products/shared/services/products.service';
import { InputComponent } from '@shared/components/forms/Input/Input.component';
import { TableComponent } from '@shared/components/table/table.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { LocalDatePipe } from '@feature/products/shared/pipes/local-date.pipe';
import { DialogService } from '@shared/services/dialog/dialog.service';
import { RouterLink } from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { MenuDirective } from '@shared/directives/menu.directive';
import { mergeMap, of } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    TableComponent,
    FormsModule,
    ReactiveFormsModule,
    FilterProductsPipe,
    LocalDatePipe,
    RouterLink,
    OverlayModule,
    PortalModule,
    MenuDirective,
  ],
  providers: [ProductsService, DialogService],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  public tableColumns = signal(productsColumns) as WritableSignal<string[]>;
  public filteredProducts = computed(() => {
    const searchTerm = this.signalSearchTerm();
    return new FilterProductsPipe().transform(
      this.products(),
      searchTerm || ''
    );
  });
  public searchTerm = new FormControl('');
  private signalSearchTerm = toSignal(this.searchTerm.valueChanges);
  private products: WritableSignal<Product[]> = signal([]);
  private productsService = inject(ProductsService);
  private dialogService = inject(DialogService);

  constructor() {
    this.getProducts();
  }

  public getProducts(): void {
    this.productsService.getProducts().subscribe((products) => {
      this.products.set(products);
    });
  }

  public deleteProduct(product: Product): void {
    const dialogRef = this.dialogService.confirmDialog({
      data: {
        message: `¿Estás seguro de eliminar el producto ${product.name}?`,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(
        mergeMap((result) => {
          if (result) {
            return this.productsService.deleteProduct(product.id);
          }
          return of(false);
        })
      )
      .subscribe({
        next: (result) => {
          if (result) {
            this.getProducts();
          }
        },
      });
  }
}
