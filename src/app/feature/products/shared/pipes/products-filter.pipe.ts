import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '@feature/products/shared/interfaces/product.interface';

@Pipe({
  name: 'filterProducts',
  standalone: true,
})
export class FilterProductsPipe implements PipeTransform {
  transform(products: Product[], searchTerm: string): Product[] {
    if (!products || !searchTerm) {
      return products;
    }
    searchTerm = searchTerm.toLowerCase().trim();
    return products.filter((product) =>
      this.matchesSearchTerm(product, searchTerm)
    );
  }

  private matchesSearchTerm(product: Product, searchTerm: string): boolean {
    return Object.values(product).some(value =>
      String(value).toLowerCase().includes(searchTerm)
    );
  }
}
