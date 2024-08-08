import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/product-list/product-list.component').then(
        (m) => m.ProductListComponent
      ),
  },
  {
    path: 'management',
    loadComponent: () =>
      import(
        './components/product-management/product-management.component'
      ).then((m) => m.ProductManagementComponent),
  },
  {
    path: 'management/:id',
    loadComponent: () =>
      import(
        './components/product-management/product-management.component'
      ).then((m) => m.ProductManagementComponent),
  },
];
