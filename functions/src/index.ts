import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import Timestamp = firebase.firestore.Timestamp;

firebase.initializeApp();
const db = firebase.firestore();

export const generateMeeting = functions.https.onCall(async (data, context) => {
  const body = data as MeetForm;
  // まずは新規ドキュメント作成
  const newMeet = db.collection('meet').doc();
  await newMeet.set(convertModel(newMeet.id, body));
  // IDを返す
  return newMeet.id;
});

export function convertModel(id: string, form: MeetForm): Meet {
  return {
    id: id,
    name: form.name,
    start: Timestamp.fromMillis(form.start),
    end: Timestamp.fromMillis(form.end),
    members: form.members.map(member => {
      const newMember: Member = { name: member.memberName };
      if (!form.hiddenMemberPay) {
        newMember.hourly = member.hourly;
      }
      return newMember;
    }),
    totalHourlyPay: form.members.map(m => {
      return m.hourly ?? 0;
    }).reduce((prev, current) => {
      return prev + current;
    }),
    total: 0,
    hiddenMemberPay: form.hiddenMemberPay
  }
}

export const manageMeeting = functions.https.onCall(async (data, context) => {
  const body = data as ManageForm;
  if (body.request === 'Start') {
    // ミリ秒を切り捨てた現在時刻を挿入
    const now = Timestamp.fromMillis((new Date().getTime() / 1000) * 1000);
    await db.doc(`meet/${body.id}`).update({
      actualStart: now
    });
  }

  if (body.request === 'End') {
    const meet = db.doc(`meet/${body.id}`);

    const meetData = ((await meet.get()).data() as Meet);
    // ミリ秒を切り捨てた現在時刻を挿入
    const now = Timestamp.fromMillis((new Date().getTime() / 1000) * 1000);
    // totalコストと時間を計算する
    const totalSeconds = (now.toMillis() - meetData.actualStart!.toMillis()) / 1000;
    const total = Math.floor(totalSeconds * meetData.totalHourlyPay / 3600)

    await meet.update({
      actualEnd: now,
      total: total
    });

    const newData = (await meet.get()).data();
  return newData;
  }

  return 'OK';
});

export interface MeetForm {
  name: string;
  start: number;
  end: number;
  members: Array<MemberForm>;
  hiddenMemberPay: boolean;
}

export interface MemberForm {
  memberName: string;
  hourly?: number;
}

export interface Meet {
  id: string;
  name: string;
  start: Timestamp;
  end: Timestamp;
  members: Array<Member>;
  actualStart?: Timestamp;
  actualEnd?: Timestamp;
  totalHourlyPay: number;
  total: number;
  hiddenMemberPay: boolean;
}

export interface Member {
  name: string
  hourly?: number;
}

export interface ManageForm {
  request: ManageRequest;
  id: string;
}

export type ManageRequest = 'Start' | 'End';
