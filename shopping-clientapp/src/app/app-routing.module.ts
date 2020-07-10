import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {Error404Component} from './core/error404/error404.component';
import {AppConfig} from './config/app.config';
import {ShoppingListDetailComponent} from './shopping/shopping-list-detail/shopping-list-detail.component';
import {ProductComponent} from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';

const routes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: AppConfig.routes.product, component: ProductComponent},
  {path: AppConfig.routes.shopping, component: CartComponent},
  {path: AppConfig.routes.order, component: OrderComponent},
  {path: AppConfig.routes.shopping, loadChildren: 'app/shopping/shopping.module#ShoppingModule'},
  {path: AppConfig.routes.error404, component: Error404Component},
  {path: '**', redirectTo: '/' + AppConfig.routes.error404}
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})

export class AppRoutingModule {
}
