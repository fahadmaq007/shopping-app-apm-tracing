import { Component, OnInit } from '@angular/core';
import {ShoppingService} from '../shopping/shared/shopping.service';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Product } from '../shopping/shared/product.model';
import { ApmService } from '../shopping/shared/apm.service';
import { ShoppingList } from '../shopping/shared/shopping-list.model';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  shoppingList: ShoppingList;
  shoppingListProducts: Product[];
  private products: Product[];
  private search: string;
  constructor(private shoppingService: ShoppingService, private activatedRoute: ActivatedRoute, 
    private formBuilder: FormBuilder, private apmService: ApmService) { 
    this.getProducts();
    this.shoppingList = this.shoppingService.initShoppingListsWithDefault();
    this.shoppingListProducts = this.shoppingService.getProductsByShoppingList(this.shoppingList);
  }

  ngOnInit() {
  }

  getProducts() {
    
    
    this.shoppingService.getProducts(this.search).subscribe((products: Array<Product>) => {
      
      this.products = products;
      this.apmService.captureTransaction('fetched ' + this.products.length + ' products ');
    });
  }

  addProductToCurrentList(product) {
    this.shoppingService.addProductToShoppingList(product, this.shoppingList);
    this.shoppingService.showSnackBar('productAdded');
    this.shoppingListProducts.unshift(product);
  }
}
