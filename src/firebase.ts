import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export default firebase;

export const app = firebase.initializeApp({
  apiKey: 'AIzaSyARB2SconW0FD_tIwhCSjSKUAZilzr5PLc',
  authDomain: 'huginn-8f1e6.firebaseapp.com',
  databaseURL: 'https://huginn-8f1e6.firebaseio.com',
  projectId: 'huginn-8f1e6',
  storageBucket: 'huginn-8f1e6.appspot.com',
  messagingSenderId: '256390309290',
  appId: '1:256390309290:web:2a9c861cbe63923b',
});

export const auth = app.auth();
export const firestore = app.firestore();

export const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();
