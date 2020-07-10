import { Component, OnInit } from '@angular/core';
import { ShoppingList } from '../shopping/shared/shopping-list.model';
import { Product } from '../shopping/shared/product.model';
import { ShoppingService } from '../shopping/shared/shopping.service';
import { Order } from '../shopping/shared/order.model';
import { AppConfig } from '../config/app.config';
import { ApmService } from '../shopping/shared/apm.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  shoppingList: ShoppingList;
  products: Product[];
  shoppingListProducts: Product[];
  
  constructor(private shoppingService: ShoppingService, private apmService: ApmService) { 
    this.prepareShoppingList();
  }

  ngOnInit() {
  }

  prepareShoppingList() {
    if (this.shoppingService.isThereShoppingLists()) {
      // if there are any shopping lists - get the first one
      this.shoppingList = this.shoppingService.getFirstShoppingList();
    } else {
      this.shoppingList = new ShoppingList(0, 'Default');
    }
    
    this.shoppingListProducts = this.shoppingService.getProductsByShoppingList(this.shoppingList);
  }
  placeOrder() {
    var products = this.shoppingListProducts;
    console.log('placing order of products', products);
    if (products && products.length > 0) {
      var order = new Order(undefined, products, AppConfig.defaultDeliveryAddress, 'ORDER_PLACED', 'order');
      this.shoppingService.placeOrder(order).subscribe(order => {
        this.clearProductsFromShoppingList();
        this.apmService.captureTransaction('placed order ' + order._id);
      });
    }
  }

  clearProductsFromShoppingList() {
    this.shoppingService.deleteShoppingListById(0);
    this.prepareShoppingList();
  }
}
