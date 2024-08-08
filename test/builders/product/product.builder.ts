import { Product } from '@feature/products/shared/interfaces/product.interface';

export class ProductBuilder {
  protected id: string = 'default-id';
  protected name: string = 'default-name';
  protected description: string = 'default-description';
  protected logo: string = 'default-logo';
  protected dateRelease: Date = new Date();
  protected dateRevision: Date = new Date();

  withId(id: string): this {
    this.id = id;
    return this;
  }

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withDescription(description: string): this {
    this.description = description;
    return this;
  }

  withLogo(logo: string): this {
    this.logo = logo;
    return this;
  }

  withDateRelease(dateRelease: Date): this {
    this.dateRelease = dateRelease;
    return this;
  }

  withDateRevision(dateRevision: Date): this {
    this.dateRevision = dateRevision;
    return this;
  }

  build(): Product {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      logo: this.logo,
      date_release: this.dateRelease,
      date_revision: this.dateRevision,
    };
  }

  buildMany(count: number): Product[] {
    const products: Product[] = [];
    for (let i = 0; i < count; i++) {
      products.push(this.build());
    }
    return products;
  }
}