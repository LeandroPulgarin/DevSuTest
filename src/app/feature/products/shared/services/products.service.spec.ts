import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { HttpService } from '@core/services/http/http.service';
import { Product } from '../interfaces/product.interface';
import { ProductBuilder } from '@builders/product/product.builder';
import { environment } from '@env/environment';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService, HttpService],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products', () => {
    const mockProducts: Product[] = new ProductBuilder().buildMany(2);

    service.getProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockProducts });
  });

  it('should fetch product by id', () => {
    const mockProduct: Product = new ProductBuilder().build();

    service.getProductById('1').subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should update product', () => {
    const mockProduct: Product = new ProductBuilder().build();

    service.putProduct(mockProduct).subscribe((response) => {
      expect(response.data).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products/${mockProduct.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: 'Product updated', data: mockProduct });
  });

  it('should create product', () => {
    const mockProduct: Product = new ProductBuilder().build();

    service.postProduct(mockProduct).subscribe((response) => {
      expect(response.data).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Product created', data: mockProduct });
  });

  it('should delete product', () => {
    service.deleteProduct('1').subscribe((response) => {
      expect(response.message).toBe('Product deleted');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Product deleted' });
  });

  it('should validate product ID', () => {
    service.validateProductId('1').subscribe((isValid) => {
      expect(isValid).toBe(true);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products/verification/1`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });
});
