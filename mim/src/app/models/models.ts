import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

export interface Summary {
  meetings: number;
  times: number;
  amounts: number;
}

export interface Meet {
  id: string;
  name: string;
  start: Timestamp;
  end: Timestamp;
  members: [Member];
  actualStart?: Timestamp;
  actualEnd?: Timestamp;
  totalHourlyPay: number;
  total: number;
  hiddenMemberPay: boolean;
}

export interface Member {
  name: string;
  hourly?: number;
}
