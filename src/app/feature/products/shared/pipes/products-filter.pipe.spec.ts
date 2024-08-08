import { ProductBuilder } from '@builders/product/product.builder';
import { Product } from '@feature/products/shared/interfaces/product.interface';
import { FilterProductsPipe } from './products-filter.pipe';

describe('FilterProductsPipe', () => {
  let pipe: FilterProductsPipe;

  beforeEach(() => {
    pipe = new FilterProductsPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the original products array if no search term is provided', () => {
    const products: Product[] = new ProductBuilder().buildMany(2);

    expect(pipe.transform(products, '')).toEqual(products);
  });

  it('should return the original products array if products array is empty', () => {
    const products: Product[] = [];
    expect(pipe.transform(products, 'Test')).toEqual(products);
  });

  it('should filter products based on the search term', () => {
    const products: Product[] = [
      new ProductBuilder().withName('Test Product 1').build(),
    ];

    const filteredProducts = pipe.transform(products, 'Test Product 1');
    expect(filteredProducts).toEqual([products[0]]);
  });

  it('should filter products regardless of case and description match', () => {
    const products: Product[] = [
      new ProductBuilder().withDescription('Test Product 1').build(),
    ];

    const filteredProducts = pipe.transform(products, 'test product 1');
    expect(filteredProducts).toEqual([products[0]]);
  });

  it('should return an empty array if no products match the search term', () => {
    const products: Product[] = new ProductBuilder().buildMany(2);

    const filteredProducts = pipe.transform(products, 'Non-existent Product');
    expect(filteredProducts).toEqual([]);
  });
});
