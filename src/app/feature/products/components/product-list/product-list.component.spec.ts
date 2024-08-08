import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ProductsService } from '@feature/products/shared/services/products.service';
import { DialogService } from '@shared/services/dialog/dialog.service';
import { ProductListComponent } from './product-list.component';
import { InputComponent } from '@shared/components/forms/Input/Input.component';
import { TableComponent } from '@shared/components/table/table.component';
import { FilterProductsPipe } from '@feature/products/shared/pipes/products-filter.pipe';
import { LocalDatePipe } from '@feature/products/shared/pipes/local-date.pipe';
import {
  provideRouter,
  RouterLink,
  withComponentInputBinding,
} from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { MenuDirective } from '@shared/directives/menu.directive';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductBuilder } from '@builders/product/product.builder';
import { DialogRef } from '@shared/services/dialog/dialog-ref';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productsService: ProductsService;
  let dialogService: DialogService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        InputComponent,
        TableComponent,
        FilterProductsPipe,
        LocalDatePipe,
        RouterLink,
        OverlayModule,
        PortalModule,
        MenuDirective,
        ProductListComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([], withComponentInputBinding()),
        ProductsService,
        DialogService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productsService = fixture.debugElement.injector.get(ProductsService);
    dialogService = fixture.debugElement.injector.get(DialogService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with a list of products', () => {
    const products = new ProductBuilder().buildMany(2);
    spyOn(productsService, 'getProducts').and.returnValue(of(products));

    component.getProducts();

    expect(productsService.getProducts).toHaveBeenCalled();
  });

  it('should filter products based on search term', () => {
    const products = [
      new ProductBuilder().withName('Test Product 1').build(),
      new ProductBuilder().withName('Test Product 2').build(),
    ];
    spyOn(productsService, 'getProducts').and.returnValue(of(products));

    component.getProducts();
    component.searchTerm.setValue('Test Product 1');

    expect(component.filteredProducts()).toEqual([products[0]]);
  });

  it('should return same products if sear term is null', () => {
    const products = [
      new ProductBuilder().withName('Test Product 1').build(),
      new ProductBuilder().withName('Test Product 2').build(),
    ];
    spyOn(productsService, 'getProducts').and.returnValue(of(products));

    component.getProducts();
    component.searchTerm.setValue(null);

    expect(component.filteredProducts()).toEqual(products);
  });

  it('should delete a product and refresh the list', () => {
    const product = new ProductBuilder().build();
    const dialogRefSpy = {
      afterClosed: () => of(true),
    };
    spyOn(dialogService, 'confirmDialog').and.returnValue(dialogRefSpy as DialogRef);
    spyOn(productsService, 'deleteProduct').and.returnValue(
      of({ message: 'Product deleted' })
    );
    spyOn(productsService, 'getProducts').and.returnValue(of([]));

    component.deleteProduct(product);

    expect(dialogService.confirmDialog).toHaveBeenCalled();
    expect(productsService.deleteProduct).toHaveBeenCalledWith(product.id);
    expect(productsService.getProducts).toHaveBeenCalled();
  });

  it('should not delete a product if the dialog is cancelled', () => {
    const product = new ProductBuilder().build();
    const dialogRefSpy = {
      afterClosed: () => of(false),
    };
    spyOn(dialogService, 'confirmDialog').and.returnValue(dialogRefSpy as DialogRef);
    spyOn(productsService, 'deleteProduct');
    component.deleteProduct(product);

    expect(dialogService.confirmDialog).toHaveBeenCalled();
    expect(productsService.deleteProduct).not.toHaveBeenCalled();
  });
});
