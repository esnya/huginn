<template lang="pug">
  v-app#app
    app-bar
    v-content
      template(v-if="user")
        timer-list(:timersRef="timersRef")
      template(v-else)
        v-container
          v-layout(align-center justify-center)
            v-btn(color="primary" @click="signIn") Sign in with Twitter
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppBar from './components/AppBar.vue';
import TimerList from './components/TimerList.vue';
import { auth, firestore, twitterAuthProvider } from './firebase';

@Component({
  components: {
    AppBar,
    TimerList,
  },
})
export default class App extends Vue {
  public user: firebase.User | null = null;

  public get timersRef(): firebase.firestore.CollectionReference | null {
    if (!this.user) return null;

    return firestore
      .collection('users')
      .doc(this.user.uid)
      .collection('timer-sets')
      .doc('default')
      .collection('timers');
  }

  public async signIn(): Promise<void> {
    await auth.signInWithPopup(twitterAuthProvider);
  }

  private unsubscribe: (() => void)[] = [];
  private created(): void {
    this.user = auth.currentUser;
    this.unsubscribe.push(
      auth.onAuthStateChanged((user: firebase.User | null) => {
        this.user = user;
      }),
    );
  }

  private destroyed(): void {
    this.unsubscribe.forEach(f => f());
  }
}
</script>
