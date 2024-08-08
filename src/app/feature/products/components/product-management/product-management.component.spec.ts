import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ProductsService } from '@feature/products/shared/services/products.service';
import { NotificationService } from '@shared/services/notifications/notifications.service';
import { ProductManagementComponent } from './product-management.component';
import { InputComponent } from '@shared/components/forms/Input/Input.component';
import {
  provideRouter,
  RouterLink,
  withComponentInputBinding,
} from '@angular/router';
import { ProductBuilder } from '@builders/product/product.builder';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ProductManagementComponent', () => {
  let component: ProductManagementComponent;
  let fixture: ComponentFixture<ProductManagementComponent>;
  let productsService: ProductsService;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        InputComponent,
        RouterLink,
        ProductManagementComponent,
      ],
      providers: [
        FormBuilder,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([], withComponentInputBinding()),
        ProductsService,
        NotificationService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductManagementComponent);
    component = fixture.componentInstance;
    productsService = fixture.debugElement.injector.get(ProductsService);
    notificationService =
      fixture.debugElement.injector.get(NotificationService);
    spyOn(notificationService, 'showNotification');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on creation', () => {
    component.ngOnInit();
    expect(component.manageForm).toBeDefined();
    expect(component.manageForm.controls['id']).toBeTruthy();
    expect(component.manageForm.controls['name']).toBeTruthy();
    expect(component.manageForm.controls['description']).toBeTruthy();
    expect(component.manageForm.controls['date_release']).toBeTruthy();
    expect(component.manageForm.controls['date_revision']).toBeTruthy();
    expect(component.manageForm.controls['logo']).toBeTruthy();
  });

  it('should call getProductById if id is provided', () => {
    const product = new ProductBuilder().build();
    spyOn(productsService, 'getProductById').and.returnValue(of(product));
    component.id = '123';
    component.ngOnInit();
    expect(productsService.getProductById).toHaveBeenCalledWith('123');
    expect(component.isEdit()).toBeTrue();
  });

  it('should disable form if getProductById fails', () => {
    spyOn(productsService, 'getProductById').and.returnValue(
      throwError(() => new Error())
    );
    component.id = '123';
    component.ngOnInit();
    expect(productsService.getProductById).toHaveBeenCalledWith('123');
    expect(component.isEdit()).toBeTrue();
    expect(component.manageForm.disabled).toBeTrue();
  });

  it('should show notification on successful product update', () => {
    const product = new ProductBuilder().build();
    spyOn(productsService, 'putProduct').and.returnValue(
      of({ message: '', data: product })
    );
    component.id = '123';
    component.ngOnInit();
    component.manageForm.controls['name'].setValue('Updated Product');
    component.submit();
    expect(productsService.putProduct).toHaveBeenCalled();
    expect(notificationService.showNotification).toHaveBeenCalledWith({
      message: 'Producto actualizado correctamente',
      severity: 'success',
    });
  });

  it('should show notification on successful product creation', () => {
    const product = new ProductBuilder().build();
    spyOn(productsService, 'validateProductId').and.returnValue(of(false));
    spyOn(productsService, 'postProduct').and.returnValue(
      of({ message: '', data: product })
    );
    component.manageForm.controls['id'].setValue('123');
    component.submit();
    expect(productsService.postProduct).toHaveBeenCalled();
    expect(notificationService.showNotification).toHaveBeenCalledWith({
      message: 'Producto creado correctamente',
      severity: 'success',
    });
  });

  it('should show error notification if product ID already exists', () => {
    spyOn(productsService, 'validateProductId').and.returnValue(of(true));
    component.manageForm.controls['id'].setValue('123');
    component.submit();
    expect(notificationService.showNotification).toHaveBeenCalledWith({
      message: 'El ID del producto ya existe',
      severity: 'error',
    });
  });

  it('should reset form', () => {
    component.manageForm.controls['id'].setValue('123');
    component.resetForm();
    expect(component.manageForm.controls['id'].value).toBeNull();
  });
});
