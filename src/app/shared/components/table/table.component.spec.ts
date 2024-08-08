/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsService } from '@feature/products/shared/services/products.service';
import { DialogService } from '@shared/services/dialog/dialog.service';
import { TableComponent } from './table.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ProductBuilder } from '@builders/product/product.builder';
import { Product } from '@feature/products/shared/interfaces/product.interface';

describe('TableComponent', () => {
  let component: TableComponent<any>;
  let fixture: ComponentFixture<TableComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientTestingModule, TableComponent],
      providers: [ProductsService, DialogService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    component.columns = signal(['column']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the initial currentPage value to 0', () => {
    expect(component.currentPage()).toBe(0);
  });

  it('should update the currentPage value when nextPage is called', () => {
    const data: Product[] = new ProductBuilder().buildMany(20);
    component.data = signal(data);
    component.nextPage();
    expect(component.currentPage()).toBe(1);
    expect(component.currentPageDisplay()).toBe(2);
    expect(component.dataQuantity()).toBe(20)
  });

  it('should not update the currentPage value when nextPage is called and already on the last page', () => {
    component.currentPage.set(component.totalPages() - 1);
    component.nextPage();
    expect(component.currentPage()).toBe(component.totalPages() - 1);
  });

  it('should update the currentPage value when previousPage is called', () => {
    component.currentPage.set(1);
    component.previousPage();
    expect(component.currentPage()).toBe(0);
  });

  it('should not update the currentPage value when previousPage is called and already on the first page', () => {
    component.previousPage();
    expect(component.currentPage()).toBe(0);
  });

  it('should update the itemsPerPageSignal value when changePageSize is called', () => {
    const event = { target: { value: '10' } };
    component.changePageSize(event as unknown as Event);
    expect(component.itemsPerPageSignal()).toBe(10);
  });
});
