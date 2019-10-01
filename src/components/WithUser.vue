<template lang="pug">
  .huginn-with-user
    template(v-if="user")
      slot(:user="user")
    template(v-else)
      v-container
        v-layout(align-center justify-center)
          v-btn(color="primary" :loading="loading" @click="signIn") Sign in with Twitter
</template>

<script lang="ts">
import { auth, twitterAuthProvider } from '../firebase';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class WithUser extends Vue {
  public user: firebase.User | null = null;
  public loading: boolean = false;

  public async signIn(): Promise<void> {
    try {
      this.loading = true;
      await auth.signInWithRedirect(twitterAuthProvider);
    } finally {
      this.loading = false;
    }
  }

  private created(): void {
    this.user = auth.currentUser;
    const unsubscribe = auth.onAuthStateChanged(
      (user: firebase.User | null) => {
        this.user = user;
      },
    );
    this.$on('destroyed', unsubscribe);
  }
}
</script>
