import firebase from 'firebase/app';
import config from './firebase.key.json';
import 'firebase/auth';
import 'firebase/firestore';

export default firebase;

export const app = firebase.initializeApp(config);

export const auth = app.auth();
export const firestore = app.firestore();

export const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();
