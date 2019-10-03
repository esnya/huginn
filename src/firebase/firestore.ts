import firebase from 'firebase/app';

export interface DocumentSnapshot<T>
  extends firebase.firestore.DocumentSnapshot {
  ref: DocumentReference<T>;
  data(options?: firebase.firestore.SnapshotOptions | undefined): T | undefined;
}

export interface QueryDocumentSnapshot<T>
  extends firebase.firestore.QueryDocumentSnapshot {
  ref: DocumentReference<T>;
  data(options?: firebase.firestore.SnapshotOptions): T;
}

export interface DocumentChange<T> extends firebase.firestore.DocumentChange {
  doc: QueryDocumentSnapshot<T>;
}

export interface QuerySnapshot<T> extends firebase.firestore.QuerySnapshot {
  docs: QueryDocumentSnapshot<T>[];
  docChanges(): DocumentChange<T>[];
}

export interface DocumentReference<T>
  extends firebase.firestore.DocumentReference {
  get(): Promise<DocumentSnapshot<T>>;
  collection<U>(path: string): CollectionReference<U>;
}

export interface CollectionReference<T>
  extends firebase.firestore.CollectionReference {
  onSnapshot(observer: {
    next?: (snapshot: QuerySnapshot<T>) => void;
    error?: (error: Error) => void;
    complete?: () => void;
  }): () => void;
  onSnapshot(
    options: firebase.firestore.SnapshotListenOptions,
    observer: {
      next?: (snapshot: QuerySnapshot<T>) => void;
      error?: (error: Error) => void;
      complete?: () => void;
    },
  ): () => void;
  onSnapshot(
    onNext: (snapshot: QuerySnapshot<T>) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void,
  ): () => void;
  onSnapshot(
    options: firebase.firestore.SnapshotListenOptions,
    onNext: (snapshot: QuerySnapshot<T>) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void,
  ): () => void;

  doc(path?: string): DocumentReference<T>;
}

export interface ExistingDocumentSnapshot<T> extends DocumentSnapshot<T> {
  data(): T;
}

export function exists<T>(
  snapshot: DocumentSnapshot<T>,
): snapshot is QueryDocumentSnapshot<T> {
  return snapshot.exists;
}

export interface Firestore extends firebase.firestore.Firestore {
  collection<T>(path: string): CollectionReference<T>;
}

export const firestore = firebase.app().firestore() as Firestore;
