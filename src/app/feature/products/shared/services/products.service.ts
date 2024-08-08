import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { HttpService } from '@core/services/http/http.service';

@Injectable()
export class ProductsService {
  private httpService = inject(HttpService);

  public getProducts(): Observable<Product[]> {
    return this.httpService
      .doGet<{ data: Product[] }>('products')
      .pipe(map((response) => response.data));
  }

  public getProductById(id: string): Observable<Product> {
    return this.httpService.doGet<Product>(`products/${id}`);
  }

  public putProduct(
    product: Product
  ): Observable<{ message: string; data: Product }> {
    return this.httpService.doPut<{ message: string; data: Product }>(
      `products/${product.id}`,
      product
    );
  }

  public postProduct(
    product: Product
  ): Observable<{ message: string; data: Product }> {
    return this.httpService.doPost<{ message: string; data: Product }>(
      'products',
      product
    );
  }

  public deleteProduct(id: string): Observable<{ message: string }> {
    return this.httpService.doDelete<{ message: string }>(`products/${id}`);
  }

  public validateProductId(id: string): Observable<boolean> {
    return this.httpService.doGet<boolean>(`products/verification/${id}`);
  }
}
