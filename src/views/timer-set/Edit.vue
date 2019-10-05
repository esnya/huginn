<template lang="pug">
  v-container
    v-card
      v-card-text
        editor(
          :data="timerSet"
          :fields="require('../../editors/TimerSet.json').fields"
          :loading="loading"
          @update="onUpdate"
        )
      v-card-actions
        v-spacer
        import-button(:timersRef="timersRef")
        v-spacer
        export-button(:timersRef="timersRef")
        v-spacer
    v-btn(
      color="primary"
      fab
      fixed bottom right
      :to="{ name: 'timer-set-home', params: { id: snapshot.ref.id } }"
    )
      v-icon mdi-check
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Unsubscribe } from 'firebase';
import { TimerSetSnapshot, TimerCollectionReference } from '../../store';
import { exists } from '../../firebase';
import TimerSet from '../../types/TimerSet';
import Editor from '../../components/editor/Editor.vue';
import ExportButton from '../../components/ExportButton.vue';
import ImportButton from '../../components/ImportButton.vue';

@Component({
  components: {
    ExportButton,
    ImportButton,
    Editor,
  },
})
export default class TimerSetEdit extends Vue {
  @Prop({ required: true, type: Object }) snapshot!: TimerSetSnapshot;
  loading = false;
  unsubscribe: Unsubscribe | null = null;

  get timerSet(): TimerSet | null {
    const snapshot = this.snapshot;
    return snapshot && exists(snapshot) ? snapshot.data() : null;
  }

  get timersRef(): TimerCollectionReference {
    return this.snapshot.ref.collection('timers');
  }

  async onUpdate<T>(path: string, value: T): Promise<void> {
    try {
      this.loading = true;
      await this.snapshot.ref.update(path, value);
    } finally {
      this.loading = false;
    }
  }
}
</script>
