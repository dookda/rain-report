import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(
    public fireStore: AngularFirestore,
    public fireStorage: AngularFireStorage
  ) { }

  getRain() {
    return new Promise<any>((resolve, reject) => {
      this.fireStore.collection('rain').get().subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  getImg(imgName: string) {
    return new Promise<any>((resolve, reject) => {
      const storageRef = this.fireStorage.storage.ref().child(imgName);
      storageRef.getDownloadURL().then((url: any) => {
        resolve(url);
      }, (err: any) => {
        reject(err);
      });
    });
  }
}
