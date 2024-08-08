import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./feature/products/products.routes').then((m) => m.productsRoutes),
  },
];
