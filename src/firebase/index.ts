import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import './setup';

export default firebase;

export const app = firebase.app();

export const auth = app.auth();
export const firestore = app.firestore();

export const providers = [
  // {
  //   color: 'gray',
  //   dark: false,
  //   text: 'Email',
  //   instance: new firebase.auth.EmailAuthProvider(),
  // },
  {
    color: 'rgb(0, 95, 209)',
    dark: true,
    text: 'Twitter',
    instance: new firebase.auth.TwitterAuthProvider(),
  },
];
