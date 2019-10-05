<template lang="pug">
  v-btn(
    :loading="loading"
    @click="onClick"
  )
    v-icon(left) mdi-file-import
    | インポート
</template>

<script lang="ts">
import { readAsText } from 'promise-file-reader';
import selectFile from 'file-select';
import { Component, Vue, Prop } from 'vue-property-decorator';
import Timer from '../types/Timer';
import TimerSet from '../types/TimerSet';
import { TimerCollectionReference } from '../store';

@Component({
  components: {},
})
export default class ExportButton extends Vue {
  @Prop({ required: true, type: Object })
  timersRef!: TimerCollectionReference;

  loading: boolean = false;

  async onClick(): Promise<void> {
    try {
      this.loading = true;

      const file = await selectFile({
        accept: 'application/json',
      });
      if (!file) {
        this.loading = false;
        return;
      }

      const json = await readAsText(file);
      const { timers, ...timer } = JSON.parse(json) as TimerSet & {
        timers: Timer[];
      };

      const timerRef = this.timersRef.parent;
      if (!timerRef) throw new Error('Could not get timerRef');

      await timerRef.update(timer);

      const timersSnapshot = await this.timersRef.get();
      await Promise.all(timersSnapshot.docs.map(doc => doc.ref.delete()));

      await Promise.all(
        timers.map(async timer => {
          const prevTimer = timersSnapshot.docs
            .map(doc => doc.data())
            .find(d => d && d.name === timer.name) as Timer | undefined;
          const timestamp =
            (prevTimer && prevTimer.timestamp) || timer.timestamp || Date.now();
          await timerRef
            .collection('timers')
            .doc(timer.name)
            .set({
              ...timer,
              timestamp,
            });
        }),
      );
    } finally {
      this.loading = false;
    }
  }
}
</script>
