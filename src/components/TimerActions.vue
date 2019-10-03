<template lang="pug">
  v-row
    v-col(cols="auto")
      v-btn(small @click="fromNow(120)") 120分後
    v-col(cols="auto")
      v-btn(small @click="charryOver(121)") 繰越121分
    v-col(cols="auto")
      v-btn(small @click="$emit('edit')") 入力
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { exists } from '../firebase';
import { TimerReference } from '../store';

@Component({
  components: {},
})
export default class TimerActions extends Vue {
  @Prop({ required: true, type: Object })
  timerRef!: TimerReference;

  async fromNow(minutes: number): Promise<void> {
    await this.timerRef.update({
      timestamp: Date.now() + minutes * 60 * 1000,
    });
  }

  async charryOver(minutes: number): Promise<void> {
    const snapshot = await this.timerRef.get();

    const now = Date.now();
    let timestamp = Number(
      (exists(snapshot) && snapshot.data().timestamp) || now,
    );

    while (timestamp <= now) {
      timestamp += minutes * 60 * 1000;
    }

    await this.timerRef.update({
      timestamp,
    });
  }
}
</script>
