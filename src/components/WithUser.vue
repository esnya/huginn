<template lang="pug">
  .huginn-with-user
    template(v-if="user")
      slot(:user="user")
    template(v-else)
      v-container(fluid)
        v-row(justify="center")
          v-col(cols="auto")
            p Sign in with...
        v-row(justify="center")
          v-col(cols="auto")
            v-btn(color="gray" :loading="loading" @click="signInAnonymously") Guest
          v-col(:key="i" cols="auto" v-for="(provider, i) in providers")
            v-btn(
              :dark="provider.dark"
              :loading="loading"
              :color="provider.color"
              @click="signIn(provider.instance)"
            ) {{provider.text}}
</template>

<script lang="ts">
import { auth, providers } from '../firebase';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class WithUser extends Vue {
  public user: firebase.User | null = null;
  public loading: boolean = false;

  readonly providers = providers;

  public async signIn(provider: firebase.auth.AuthProvider): Promise<void> {
    try {
      this.loading = true;
      await auth.signInWithRedirect(provider);
    } finally {
      this.loading = false;
    }
  }

  async signInAnonymously(): Promise<void> {
    try {
      this.loading = true;
      await auth.signInAnonymously();
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
