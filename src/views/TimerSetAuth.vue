<template lang="pug">
  v-container
    v-row(justify-center)
      v-card
        v-card-title パスワードが必要です。
        v-card-text
          v-text-field(label="password" v-model="password")
        v-card-actions
          v-spacer
          v-btn(
            color="primary"
            :disabled="!password"
            :loading="loading"
            @click="join"
          ) OK
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { firestore } from '../firebase';

@Component({
  components: {},
})
export default class TimerSetAuth extends Vue {
  @Prop({ required: true, type: Object }) user!: { uid: string };
  password: string | null = null;
  loading: boolean = false;

  async join(): Promise<void> {
    if (!this.password) return;
    const { timerSetId } = this.$route.params;
    this.loading = true;
    await firestore
      .collection('timer-sets')
      .doc(timerSetId)
      .collection('members')
      .doc(this.user.uid)
      .set({
        password: this.password,
      });
    this.loading = false;
    this.$router.push({ name: 'timer-set', params: { timerSetId } });
  }
}
</script>
