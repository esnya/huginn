import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import './setup';

export default firebase;

export const app = firebase.app();

export const auth = app.auth();
export const firestore = app.firestore();

export const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();
