<template lang="pug">
  .huginn-timer-set
    v-app-bar(
      app
      dark
      fixed
      color="primary"
    )
      v-app-bar-nav-icon
        img.huginn-nav-icon(:src="require('../assets/icon.png')")
      v-toolbar-title {{name ? name : 'HUGINN'}}
      v-spacer
      v-btn(icon @click="signOut")
        v-icon mdi-logout
    v-content
      router-view(
        :reference="ref"
        :snapshot="snapshot"
        :user="user"
        v-if="snapshot || $route.meta.allowNull"
      )
      v-container(v-else)
        v-row(align="center" justify="center")
          v-col(cols="auto")
            v-progress-circular(color="primary" indeterminate)
        v-row(align="center" justify="center")
          v-col(cols="auto") なう、ろーでぃんぐ。
</template>

<style lang="stylus" scoped>
.huginn-nav-icon
  max-height 48px
  max-width 48px
</style>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { auth } from '../firebase';
import store, { exists, TimerSetReference, TimerSetSnapshot } from '../store';

@Component({
  components: {},
})
export default class TimerSet extends Vue {
  @Prop({ required: true, type: Object }) user!: firebase.User;

  get id(): string {
    return this.$route.params.id;
  }

  get ref(): TimerSetReference {
    return store.collection('timer-sets').doc(this.id);
  }

  get name(): string | null {
    return this.snapshot && exists(this.snapshot)
      ? this.snapshot.get('name')
      : null;
  }

  snapshot: TimerSetSnapshot | null = null;

  unsubscribe: (() => void) | null = null;
  @Watch('ref', { immediate: true }) async updateSnapshot(): Promise<void> {
    if (this.unsubscribe) this.unsubscribe();
    this.unsubscribe = this.ref.onSnapshot(snapshot => {
      this.snapshot = snapshot;
    });

    try {
      this.snapshot = await this.ref.get();
    } catch (e) {
      if (e.code === 'permission-denied' && !this.$route.meta.allowNull) {
        this.$router.push({ name: 'timer-set-join', params: { id: this.id } });
      } else {
        throw e;
      }
    }
  }

  async signOut(): Promise<void> {
    await auth.signOut();
  }

  @Watch('name')
  updateTitle(): void {
    document.title = this.name ? `${this.name} - Huginn` : 'Huginn';
  }
}
</script>
