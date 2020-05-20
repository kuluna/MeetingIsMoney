import { Component, OnInit, NgZone } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireFunctions } from '@angular/fire/functions';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css']
})
export class GenerateComponent implements OnInit {
  requesting: boolean;

  form: FormGroup = this.builder.group({
    name: ['', Validators.required],
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
    private ngZone: NgZone,
    private route: Router,
    private functions: AngularFireFunctions
    ) { }

  ngOnInit(): void {
  }

  sanitize() {
    this.form.patchValue({
      name: this.form.value.name.trim()
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
    this.requesting = true;

    // 日付をミリ秒形式に書き換え
    const value = this.form.value;
    value.start = new Date(value.start).getTime();
    value.end = new Date(value.end).getTime();
    const response = this.functions.httpsCallable<any, string>('generateMeeting')(value);
    response.subscribe(meetId => {
      this.ngZone.run(() => this.route.navigate(['/meet', meetId]));
    });
  }
}

export const validateDate: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const start = control.get('start').value;
  const end = control.get('end').value;
  const members = (control.get('members') as FormArray).value.length

  return (start >= end || members === 0) ? { invalidRange: true } : null;
};
