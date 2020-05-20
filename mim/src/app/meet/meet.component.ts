import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { firestore } from 'firebase/app';
import { Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import Timestamp = firestore.Timestamp;

import { Meet, ManageForm } from '../models/models';
import '../models/currency';

@Component({
  selector: 'app-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.css']
})
export class MeetComponent implements OnInit {
  id: string;
  meet: Observable<Meet>;
  time: string;
  total: number = 0;
  loading: boolean = true;

  timerCounter: any;

  constructor(
    private route: ActivatedRoute,
    private fireStore: AngularFirestore,
    private functions: AngularFireFunctions
  ) { }

  ngOnInit(): void {
   this.meet = this.route.params.pipe(
      map(params => params['id']),
      tap(id => this.id = id),
      mergeMap(id => this.getMeeting(id)),
      tap(meet => {
        this.loading = false;
        if (meet.total != 0) {
          this.total = meet.total;
          this.time = this.getMeetingTime(meet.actualStart, meet.actualEnd);
        }
      })
    );

    this.meet.subscribe(meet => {
      const state = this.getMeetingState(meet);
      if (state == 'Meeting') {
        this.timerCounter = setInterval(() => {
          this.total = this.calculateTotal(meet);
          this.time = this.getMeetingTime(meet.actualStart, Timestamp.now());
        }, 1000);
      }
      if (state === 'Finished') {
        if (this.timerCounter != undefined) {
          clearInterval(this.timerCounter);
        }
      }
    });
  }

  getMeeting(id: string): Observable<Meet> {
    return this.fireStore.doc<Meet>(`meet/${id}`).valueChanges();
  }

  getMeetingState(meet: Meet): MeetingState {
    if (meet.actualStart != null) {
      if (meet.actualEnd != null) {
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

    const hourString = Math.floor(seconds / 3600);
    const minuteString = ('00' + Math.floor((seconds / 60)) % 60).slice(-2);
    const secondString = ('00' + Math.floor(seconds % 60)).slice(-2);
    return `${hourString}:${minuteString}:${secondString}`;
  }

  calculateTotal(meet: Meet): number {
    const seconds = (new Date().getTime() - meet.actualStart.toMillis()) / 1000;
    return (meet.totalHourlyPay / 3600) * seconds;
  }

  startMeeting() {
    this.loading = true;

    const requestForm: ManageForm = {
      request: 'Start',
      id: this.id
    };
    const response = this.functions.httpsCallable<ManageForm, any>("manageMeeting")(requestForm);
    response.subscribe();
  }

  endMeeting() {
    this.loading = true;

    const requestForm: ManageForm = {
      request: 'End',
      id: this.id
    };
    const response = this.functions.httpsCallable<ManageForm, any>("manageMeeting")(requestForm);
    response.subscribe();
  }
}

type MeetingState = 'Ready' | 'Meeting' | 'Finished';
