import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import Timestamp = firestore.Timestamp;

import { Meet } from '../models/models';
import '../models/currency';
import { Time } from '@angular/common';
import { stringify } from 'querystring';

@Component({
  selector: 'app-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.css']
})
export class MeetComponent implements OnInit {
  id: string;
  meet: Observable<Meet>;

  constructor(
    private route: ActivatedRoute,
    private fireStore: AngularFirestore
  ) { }

  ngOnInit(): void {
   this.meet = this.route.params.pipe(
      map(params => params['id']),
      tap(id => this.id = id),
      mergeMap(id => this.getMeeting(id)),
      tap(meet => console.log(meet))
    );
  }

  getMeeting(id: string): Observable<Meet> {
    return this.fireStore.doc<Meet>(`meet/${id}`).valueChanges();
  }

  getMeetingState(meet: Meet): MeetingState {
    if (meet.actualStart !== null) {
      if (meet.actualEnd !== null) {
        return "Finished";
      } else {
        return "Meeting";
      }
    } else {
      return "Ready";
    }
  }

  getMeetingTime(start: Timestamp, end: Timestamp): string {
    const seconds = (end.toMillis() - start.toMillis()) / 1000;

    const hourString = seconds / 3600;
    const minuteString = ('00' + (seconds / 60) % 60).slice(-2);
    const secondString = ('00' +(seconds % 60)).slice(-2);
    return `${hourString}:${minuteString}:${secondString}`;
  }
}

type MeetingState = 'Ready' | 'Meeting' | 'Finished';
