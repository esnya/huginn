<template lang="pug">
  v-container(fluid)
    v-row(justify="center")
      v-col(cols="auto")
        v-card
          v-card-title パスワードが設定されています。
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
import { TimerSetReference } from '../../store';

@Component({
  components: {},
})
export default class TimerSetJoin extends Vue {
  @Prop({ required: true, type: Object }) user!: { uid: string };
  @Prop({ required: true, type: Object }) reference!: TimerSetReference;
  password: string | null = null;
  loading: boolean = false;

  async join(): Promise<void> {
    try {
      if (!this.password) return;

      this.loading = true;
      await this.reference
        .collection('members')
        .doc(this.user.uid)
        .set({
          password: this.password,
        });
      this.$router.push({
        name: 'timer-set-home',
        params: { id: this.reference.id },
      });
    } finally {
      this.loading = false;
    }
  }
}
</script>
