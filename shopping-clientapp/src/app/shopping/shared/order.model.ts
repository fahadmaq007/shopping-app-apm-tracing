import { Product } from "./product.model";

export class Order {
  private _rev: string;

  constructor(
    public _id: string,
    public products: Product[],
    public deliveryAddress: string,
    public status: string, public type: string) {
  }

  getRev() {
    return this._rev;
  }
}
