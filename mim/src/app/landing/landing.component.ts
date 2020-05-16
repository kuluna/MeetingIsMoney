import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Summary } from '../models/models';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  summary: Observable<Summary>;

  constructor(private fireStore: AngularFirestore) {}

  ngOnInit(): void {
      this.summary = this.fireStore.doc<Summary>('total/summary').valueChanges();

      this.summary.subscribe(value => {
        console.log(value);
      });
  }
}
