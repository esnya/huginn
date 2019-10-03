<template lang="pug">
  v-tooltip(left)
    template(v-slot:activator="{ on }")
      v-btn(
        color="primary"
        fab
        :loading="loading"
        v-on="on"
        @click="onClick"
      )
        v-icon mdi-file-export
    span エクスポート
</template>

<script lang="ts">
import { save } from 'save-file';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { TimerCollectionReference } from '../store';

@Component({
  components: {},
})
export default class ExportFab extends Vue {
  @Prop({ required: true, type: Object })
  timersRef!: TimerCollectionReference;

  loading: boolean = false;

  async onClick(): Promise<void> {
    try {
      this.loading = true;
      const timerRef = this.timersRef.parent;
      if (!timerRef) throw new Error('timerRef is undefined');

      const timer = (await timerRef.get()).data() || {};
      const timers = (await this.timersRef.get()).docs.map(doc => doc.data());
      const json = JSON.stringify(
        {
          ...timer,
          timers,
        },
        null,
        2,
      );
      save(new Blob([json]), `${timer.name || 'timer'}.json`);
    } finally {
      this.loading = false;
    }
  }
}
</script>
