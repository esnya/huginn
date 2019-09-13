<template lang="pug">
  v-app-bar(
    app
    collapse-on-scroll
    dark
    fixed
    color="primary"
  )
    v-app-bar-nav-icon
      v-icon mdi-timer
    v-toolbar-title HUGINN
    v-spacer
    template(v-if="user")
      v-btn(icon @click="signOut")
        v-icon mdi-account
    template(v-else)
      v-btn(icon @click="signIn")
        v-icon mdi-login
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import firebase, { auth } from '../firebase';

@Component({
  components: {},
})
export default class AppBar extends Vue {
  public user: firebase.User | null = null;

  public async signIn(): Promise<void> {
    const provider = new firebase.auth.TwitterAuthProvider();
    const result = await auth.signInWithPopup(provider);
    this.user = result.user;
  }

  public async signOut(): Promise<void> {
    await auth.signOut();
    this.user = null;
  }

  private created(): void {
    this.user = auth.currentUser;
  }
}
</script>
