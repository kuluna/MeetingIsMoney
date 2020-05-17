import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
// import Timestamp = firebase.firestore.Timestamp;

firebase.initializeApp();
const db = firebase.firestore();

export const generateMeeting = functions.https.onCall(async (data, context) => {
  let body = data;
  // まずは新規ドキュメント作成
  const newMeet = db.collection('meet').doc();
  body.id = newMeet.id;
  const result = await newMeet.set(body);
  console.log(result);
  // 更新されたドキュメントを返す
  const meet = await newMeet.get();
  return meet.data();
});

export interface MeetForm {
  start: string;
  end: Date;
  name: Date;
  members: Array<MemberForm>;
  hiddenMemberPay: boolean;
}

export interface MemberForm {
  name: string;
  hourly?: number;
}
