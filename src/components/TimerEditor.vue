<template lang="pug">
  v-dialog(width="auto" :value="Boolean(timerRef)" @input="emitInput($event ? timerRef : null)")
    v-card
      v-card-title(v-if="timer") {{timer.name}}
      v-card-text(v-if="timer")

      v-card-text(v-if="!timer")
        v-row(align="center" justify="center")
          v-col(cols="auto")
            v-progress-circular(interdimiate)
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import Timer from '../types/Timer';
import { Unsubscribe } from 'firebase';
import { TimerReference } from '../store';
import { exists } from '../firebase';

@Component({
  components: {},
})
export default class TimerEditor extends Vue {
  @Prop({ required: false, type: Object })
  timerRef?: TimerReference | null;

  @Emit('input')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  emitInput(value: TimerReference | null) {}

  unsubscribe?: Unsubscribe;
  @Watch('timerRef', { immediate: true }) async updateTimer(
    timerRef: TimerReference,
  ): Promise<void> {
    this.timer = null;
    const snapshot = await timerRef.get();
    if (!exists(snapshot)) return;

    this.timer = snapshot.data();
  }

  timer: Timer | null = null;
}
</script>
