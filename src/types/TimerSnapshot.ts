import Timer from './Timer';

export default interface TimerSnapshot extends Timer {
  ref: firebase.firestore.DocumentReference;
}
