import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import * as faker from 'faker';
import {Product} from '../models/product';

// import {UploadService} from '@admin/upload.service';

import {Observable} from 'rxjs';
// import { fromPromise } from 'rxjs/observable';
import { from } from 'rxjs';
import { expand, takeWhile, mergeMap, take } from 'rxjs/operators';

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

  remove(id): Promise<any> {
    const ref = this.product(id);
    return new Promise((resolve, reject) => {
      this.deleteUploadsCollection(`products/${id}/uploads`, 1).subscribe(() => {
        ref.delete().then(() => {
          resolve(true);
        }).catch(error => {
          reject(error);
        });
      });
    });
  }

  private deleteUploadsCollection(path: string, limit: number): Observable<any> {
    const source = this.deleteBatch(path, limit);
    return source.pipe(
      expand(val => this.deleteBatch(path, limit)),
      takeWhile(val => val > 0)
    );
  }

  private deleteBatch(path: string, limit: number): Observable<any> {
    const ref = this.afs.collection(path, ref2 => ref2.orderBy('__name__').limit(limit));
    return ref.snapshotChanges().pipe(
      take(1),
      mergeMap(snapshot => {
        const batch = this.afs.firestore.batch();
        snapshot.forEach(doc => {
          // this.uploadService.removeFile(doc.payload.doc.id);
          batch.delete(doc.payload.doc.ref);
        });
        // return fromPromise(batch.commit()).map(() => snapshot.length)
        return from(batch.commit());
      })
    );
  }
}
