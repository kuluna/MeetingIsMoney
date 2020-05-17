import { Component, OnInit, Output, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Member, Meet } from '../models/models';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css']
})
export class GenerateComponent implements OnInit {


  form: FormGroup = this.builder.group({
    meetingName: ['', Validators.required],
    start: ['', Validators.required],
    end: ['', Validators.required],
    members: this.builder.array([
      this.builder.group({
        memberName: ['', Validators.required],
        hourly: [1000, Validators.min(1)]
      })
    ]),
    hiddenMemberPay: [false],
    agree: [false, Validators.requiredTrue]
  }, {
    validators: validateDate
  });

  constructor(
    private builder: FormBuilder,
    private route: Router,
    private functions: AngularFireFunctions
    ) { }

  ngOnInit(): void {
  }

  sanitize() {
    this.form.patchValue({
      meetingName: this.form.value.meetingName.trim()
    });
  }

  getMembers(): FormArray {
    return this.form.get('members') as FormArray;
  }

  newMember() {
    this.getMembers().push(
      this.builder.group({
        memberName: ['', Validators.required],
        hourly: [1000, Validators.min(1)]
      })
    );
  }

  removeMember(index: number) {
    this.getMembers().removeAt(index);
  }

  onSubmit() {
    const response = this.functions.httpsCallable<any, MeetResponse>('generateMeeting')(this.form.value);
    response.subscribe(response => {
      console.log(response.result);
      this.route.navigate(['/meet', response.result.id]);
    });
  }

  formJson() { return JSON.stringify(this.form.value); }
}

export const validateDate: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const start = control.get('start').value;
  const end = control.get('end').value;
  const members = (control.get('members') as FormArray).value.length

  return (start >= end || members === 0) ? { invalidRange: true } : null;
};

export interface MeetResponse {
  result: Meet;
}
