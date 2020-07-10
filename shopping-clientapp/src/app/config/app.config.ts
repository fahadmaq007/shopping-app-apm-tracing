import {InjectionToken} from '@angular/core';

export let APP_CONFIG = new InjectionToken('app.config');

export const AppConfig = {
  routes: {
    shopping: 'cart',
    product: 'products',
    order: 'orders',
    vendor: 'vendor',
    courier: 'courier',
    error404: '404'
  },
  endpoints: {
    productsBaseUrl: 'http://localhost:8082/apm/',
    productsGetPath: 'products',
    ordersBaseUrl: 'http://localhost:8081/apm/orders'
  },
  snackBarDuration: 3000,
  repositoryURL: 'https://github.com/affilnost/angular5-example-shopping-app',
  defultSHContent: '[]',
  defaultDeliveryAddress: 'Alina Residency, WAT Street, Bangalore.'
};
