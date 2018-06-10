import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import * as faker from 'faker';
import {Product} from '../models/product';

type productsCollection = AngularFirestoreCollection<Product[]>;
type productDocument = AngularFirestoreDocument<Product>;

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private afs: AngularFirestore
  ) { }

  products(): productsCollection {
    return this.afs.collection<Product[]>('products');
  }

  product(id: string): productDocument {
    return this.afs.doc<Product>(`products/${id}`);
  }

  save(product: Product): Promise<any> {
    product.id = faker.random.alphaNumeric(16);
    return this.products().doc(product.id).set(Object.assign({}, product));
  }

  update(product: Product): Promise<any> {
    return this.product(product.id).update(Object.assign({}, product));
  }

  getProductImages(productId: string) {
    return this.afs.doc<Product>(`products/${productId}`).collection('uploads');
  }
}
