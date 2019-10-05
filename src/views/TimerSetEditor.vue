<template lang="pug">
  v-container(v-if="timerSet")
    v-card
      v-card-text
        editor(
          :data="timerSet"
          :fields="require('../editors/TimerSet.json').fields"
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
      :to="{ name: 'timer-set', params: { timerSetId } }"
    )
      v-icon mdi-check
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Unsubscribe } from 'firebase';
import store, {
  TimerSetReference,
  TimerSetSnapshot,
  TimerCollectionReference,
} from '../store';
import { exists } from '../firebase';
import TimerSet from '../types/TimerSet';
import Editor from '../components/editor/Editor.vue';
import ExportButton from '../components/ExportButton.vue';
import ImportButton from '../components/ImportButton.vue';

@Component({
  components: {
    ExportButton,
    ImportButton,
    Editor,
  },
})
export default class TimerSetEditor extends Vue {
  get timerSetId(): string {
    return this.$route.params.timerSetId;
  }

  get timerSetRef(): TimerSetReference {
    return store.collection('timer-sets').doc(this.timerSetId);
  }

  get timersRef(): TimerCollectionReference {
    return this.timerSetRef.collection('timers');
  }

  loading = false;
  timerSetSnapshot: TimerSetSnapshot | null = null;
  unsubscribe: Unsubscribe | null = null;

  @Watch('timerSetRef', { immediate: true })
  async updateSnapshot(): Promise<void> {
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    this.unsubscribe = this.timerSetRef.onSnapshot(
      snapshot => (this.timerSetSnapshot = snapshot),
    );
    this.timerSetSnapshot = await this.timerSetRef.get();
  }

  get timerSet(): TimerSet | null {
    const snapshot = this.timerSetSnapshot;
    return snapshot && exists(snapshot) ? snapshot.data() : null;
  }

  async onUpdate<T>(path: string, value: T): Promise<void> {
    try {
      this.loading = true;
      await this.timerSetRef.update(path, value);
    } finally {
      this.loading = false;
    }
  }
}
</script>
