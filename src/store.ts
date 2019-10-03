import { firestore, CollectionReference, DocumentReference } from './firebase';
import TimerSet from './types/TimerSet';
import Timer from './types/Timer';
import TimerSetMember from './types/TimerSetMember';

export type TimerSetMemberReference = DocumentReference<TimerSetMember>;
export type TimerSetMemberCollectionReference = CollectionReference<
  TimerSetMember
>;

export type TimerReference = DocumentReference<Timer>;
export type TimerCollectionReference = CollectionReference<Timer>;

export interface TimerSetReference extends DocumentReference<TimerSet> {
  collection<U = Timer>(path: 'timers'): CollectionReference<U>;
  collection<U = TimerSetMember>(path: 'member'): CollectionReference<U>;
}

export interface TimerSetCollectionReference
  extends CollectionReference<TimerSet> {
  doc(path: string): TimerSetReference;
}

export interface Store {
  collection(path: 'timer-sets'): TimerSetCollectionReference;
}

const store: Store = firestore;
export default store;
