import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  public data: any;
  public img: any;
  constructor(
    public fstore: AngularFirestore,
    public fstorage: AngularFireStorage,
    public router: Router
  ) {
    this.data = this.router.getCurrentNavigation().extras.state;
    // console.log(this.data)
  }

  ngOnInit() {
    this.showDetail();
  }

  showDetail() {
    const storageRef = this.fstorage.storage.ref().child(this.data.img);
    storageRef.getDownloadURL().then((url) => {
      this.img = url;
      console.log(url);
    });

  }

}
