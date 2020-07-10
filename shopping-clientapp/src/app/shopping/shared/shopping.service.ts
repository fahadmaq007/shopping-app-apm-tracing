import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {AppConfig} from '../../config/app.config';

import {ShoppingList} from './shopping-list.model';
import {Observable} from 'rxjs/Observable';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {catchError, map} from 'rxjs/operators';
import {Product} from './product.model';
import {_throw} from 'rxjs/observable/throw';
import {of} from 'rxjs/observable/of';
import { ApmService } from './apm.service';
import { Order } from './order.model';

@Injectable()
export class ShoppingService {

  private headers: HttpHeaders;
  private productsGetUrl: string;
  private productsBaseUrl: string;
  private translations: any;
  private shoppinglistPrefix: string;
  private shoppinglistsPrefix: string;
  private maxTitleLength: number;
  private defaultSL: string;
  private ordersBaseUrl: string;

  constructor(private http: HttpClient,
              private translateService: TranslateService,
              private snackBar: MatSnackBar) {
    this.productsBaseUrl = AppConfig.endpoints.productsBaseUrl;
    this.productsGetUrl = this.productsBaseUrl + AppConfig.endpoints.productsGetPath;
    
    this.ordersBaseUrl = AppConfig.endpoints.ordersBaseUrl;
    this.defaultSL = AppConfig.defultSHContent;
    this.shoppinglistPrefix = 'shopping-list-';
    this.shoppinglistsPrefix = 'shopping-lists';
    this.maxTitleLength = 50;

    this.headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.translateService.get(
      ['shoppingListCreated', 'saved', 'shoppingListRemoved', 'productAdded', 'productRemovedFromShoppingList'])
      .subscribe((texts) => {
        this.translations = texts;
      });
  }

  private handleError(error: any) {
    if (error instanceof Response) {
      return _throw(error.json()['error'] || 'backend server error');
    }
    // in a case server returns 400 error, which means no data found
    return of([]);
  }

  private cropText(text: string): string {
    if (text.length > this.maxTitleLength) {
      return text.substring(0, this.maxTitleLength) + '...';
    } else {
      return text;
    }
  }

  getProductsByShoppingList(shoppingList: ShoppingList): Product[] {
    return JSON.parse(localStorage.getItem(this.shoppinglistPrefix + shoppingList.id)) || [];
  }

  addProductToShoppingList(product, shoppingList) {
    const products = this.getProductsByShoppingList(shoppingList);
    products.unshift(product);
    localStorage.setItem(this.shoppinglistPrefix + shoppingList.id, JSON.stringify(products));
    return product;
  }

  removeProductFromShoppingList(product: Product, shoppingList: ShoppingList) {
    let slProducts = this.getProductsByShoppingList(shoppingList);
    slProducts = slProducts.filter(sl => sl.id !== product.id);
    localStorage.setItem(this.shoppinglistPrefix + shoppingList.id, JSON.stringify(slProducts));
  }

  isThereShoppingLists(): boolean {
    if (!this.getAllShoppingLists().length) {
      return false;
    }
    return true;
  }

  getFirstShoppingList(): ShoppingList {
    const shLists = this.getAllShoppingLists();
    if (shLists.length) {
      return shLists[0];
    } else {
      return null;
    }
  }

  initShoppingListsWithDefault(): ShoppingList {
    const shoppingList = new ShoppingList(0, 'Default');
    const shoppingLists = [shoppingList];
    localStorage.setItem(this.shoppinglistsPrefix, JSON.stringify(shoppingLists));
    localStorage.setItem(this.shoppinglistPrefix + 0, this.defaultSL);
    return shoppingList;
  }

  getAllShoppingLists(): ShoppingList[] {
    return JSON.parse(localStorage.getItem(this.shoppinglistsPrefix)) || [];
  }

  getShoppingListById(slId: string): ShoppingList {
    const shoppingLists = this.getAllShoppingLists().sort((a, b) => a.id - b.id);
    return shoppingLists.filter(sl => sl.id === parseInt(slId))[0];
  }

  createShoppingList(shoppingList: any): ShoppingList {
    const shoppingLists = this.getAllShoppingLists().sort((a, b) => a.id - b.id);
    shoppingList.id = shoppingLists.length ? shoppingLists[shoppingLists.length - 1].id + 1 : 0;
    shoppingLists.push(shoppingList);
    localStorage.setItem(this.shoppinglistsPrefix, JSON.stringify(shoppingLists));
    return shoppingList;
  }

  updateShoppingList(shoppingList: ShoppingList): ShoppingList {
    let shoppingLists = this.getAllShoppingLists();
    shoppingLists = shoppingLists.map((sl: ShoppingList) => sl.id === shoppingList.id ? shoppingList : sl);
    localStorage.setItem(this.shoppinglistsPrefix, JSON.stringify(shoppingLists));
    return shoppingList;
  }

  deleteShoppingListById(id: any) {
    let shoppingLists = this.getAllShoppingLists().sort((a, b) => a.id - b.id);
    localStorage.removeItem(this.shoppinglistPrefix + id);
    shoppingLists = shoppingLists.filter(sl => sl.id !== id);
    localStorage.setItem(this.shoppinglistsPrefix, JSON.stringify(shoppingLists));
  }

  showSnackBar(name): void {
    const config: any = new MatSnackBarConfig();
    config.duration = AppConfig.snackBarDuration;
    this.snackBar.open(this.translations[name], 'OK', config);
  }


  getProducts(query?: string): Observable<Product[]> {
    query = query || '';
    console.log("query " + query);
    var url = this.productsGetUrl + '?filters=type:EQ:product';
    if (query.length > 0) {
      url = url + ',name:LIKE:' + query;
    }
    const authorization = 'Basic MzJjZjQtODVhNjktYmI0OTEtYjA2NmItYzA0MTQtNDBmN2Q6ZGFmMTYtOWNiMGUtYzFlNmMtMTdhZWEtNmU2Y2YtNmQzM2I=';
    return this.http.get(url, {
      'headers': {
        'Authorization': authorization
      }
    }).pipe(catchError(
      error => this.handleError(error)
    ));
  }

  placeOrder(order: Order): Observable<Order> {
    var url = this.ordersBaseUrl;
    return this.http.put(url, order, {
    }).pipe(catchError(
      error => this.handleError(error)
    ));
  }

  getOrders(query?: string): Observable<Order[]> {
    var url = this.ordersBaseUrl + '?filters=type:EQ:order';
    return this.http.get(url, {
    }).pipe(catchError(
      error => this.handleError(error)
    ));
  }
}
