<template lang="pug">
  v-container
    v-row(justify-center)
      v-card
        v-card-title パスワードが必要です。
        v-card-text
          v-text-field(label="password" v-model="password")
        v-card-actions
          v-spacer
          v-btn(color="primary" :disabled="!password" @click="join") OK
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class TimerSetAuth extends Vue {
  password: string | null = null;

  join() {
    if (!this.password) return;
  }
}
</script>
