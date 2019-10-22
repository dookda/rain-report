import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Router } from '@angular/router';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  public data: any;
  public dataArr = [];

  constructor(
    public service: ServiceService,
    public fstore: AngularFirestore,
    public fstorage: AngularFireStorage,
    public router: Router
  ) { }

  ngOnInit() {
    this.loadData();
  }


  loadData() {
    // const storageRef = this.fstorage.storage.ref().child('imgs/_1568335502426_bg5.jpg');
    // const da = storageRef.getDownloadURL().then(url => return url);
    this.fstore.collection('rain').get().subscribe((res: any) => {
      res.docs.map((url: any) => {
        // console.log(url.data());
        this.dataArr.push(url.data());
      });
    });
  }

  gotoDetail(d: any) {
    // console.log(d)
    this.router.navigateByUrl('detail', { state: d });
  }

}

export interface Rain {
  rain: number;
  reporter: string;
  desc: string;
  lat?: number;
  lon?: number;
  img?: string;
}
