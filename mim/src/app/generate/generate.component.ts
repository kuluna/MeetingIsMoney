import { Component, OnInit, Output, Input } from '@angular/core';
import {} from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Member, Meet } from '../models/models';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css']
})
export class GenerateComponent implements OnInit {
  form = new MeetForm(
    '',
    [new MemberForm('', 1000)],
    false,
    false
  );

  constructor(
    private route: Router,
    private functions: AngularFireFunctions
    ) { }

  ngOnInit(): void {
  }

  sanitize() {
    this.form.name = this.form.name.trim();
  }

  newMember() {
    this.form.members.push(new MemberForm('', 1000));
  }

  removeMember(index: number) {
    this.form.members.splice(index, 1);
  }

  onSubmit() {
    // const response = this.functions.httpsCallable<MeetForm, Meet>('generate')(this.form);
    // response.subscribe(meet => {
    //   this.route.navigate(['/meet', meet.id]);
    // });
  }

  formJson() { return JSON.stringify(this.form); }
}

export class MeetForm {
  start?: string;
  end?: string;

  constructor(
    public name: string,
    public members: Array<MemberForm>,
    public hiddenMemberPay: boolean,
    public agree: boolean
  ){}

  invalid(): boolean {
    if (this.name === '') return true;
    if (this.start === null) return true;
    if (this.end === null) return true;
    if (this.start >= this.end) return true;
    if (this.members.length === 0) return true;
    if (!this.agree) return true;

    return false;
  }
}

export class MemberForm implements Member {
  constructor(
    public name: string,
    public hourly?: number
  ) {}
}
