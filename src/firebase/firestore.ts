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

export type SnapshotListenOptions = firebase.firestore.SnapshotListenOptions;
export type FirestoreError = firebase.firestore.FirestoreError;

export interface DocumentReference<T>
  extends firebase.firestore.DocumentReference {
  onSnapshot(observer: {
    next?: (snapshot: DocumentSnapshot<T>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
  }): () => void;
  onSnapshot(
    options: SnapshotListenOptions,
    observer: {
      next?: (snapshot: DocumentSnapshot<T>) => void;
      error?: (error: Error) => void;
      complete?: () => void;
    },
  ): () => void;
  onSnapshot(
    onNext: (snapshot: DocumentSnapshot<T>) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void,
  ): () => void;
  onSnapshot(
    options: SnapshotListenOptions,
    onNext: (snapshot: DocumentSnapshot<T>) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void,
  ): () => void;

  get(): Promise<DocumentSnapshot<T>>;
  update(data: Partial<T>): Promise<void>;
  update<U, V = any>(
    path: string | firebase.firestore.FieldPath,
    value: U,
    ...mores: V[]
  ): Promise<void>;

  collection<U>(path: string): CollectionReference<U>;
}

export interface Query<T> extends firebase.firestore.Query {
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

  where<U>(
    fieldPath: string,
    opStr: firebase.firestore.WhereFilterOp,
    value: U,
  ): Query<T>;

  idEqual(other: firebase.firestore.Query): boolean;
}

export interface CollectionReference<T>
  extends firebase.firestore.CollectionReference,
    Query<T> {
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

  where<U>(
    fieldPath: string,
    opStr: firebase.firestore.WhereFilterOp,
    value: U,
  ): Query<T>;

  doc(path?: string): DocumentReference<T>;

  isEqual(other: firebase.firestore.CollectionReference): boolean;
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
