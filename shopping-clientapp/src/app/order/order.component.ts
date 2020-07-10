import { Component, OnInit } from '@angular/core';
import { Order } from '../shopping/shared/order.model';
import { ShoppingService } from '../shopping/shared/shopping.service';
import { ApmService } from '../shopping/shared/apm.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  private orders: Order[];
  private search: string;
  constructor(private shoppingService: ShoppingService, private apmService: ApmService) { 
    this.getOrders();
  }

  ngOnInit() {
  }

  getOrders() {
    this.shoppingService.getOrders(this.search).subscribe((orders: Array<Order>) => {
      this.orders = orders;
      //this.apmService.captureTransaction('fetched ' + this.orders.length + ' orders ');
    });
  }

  confirmOrder(order: Order ) {
    order.status = "APPROVED";
    console.log('placed order ', order);
    this.shoppingService.placeOrder(order).subscribe((order: Order) => {
      console.log('placed order ', order);
      this.apmService.captureTransaction('placed order ' + order._id);
      this.getOrders();
    });
  }
}
