<template lang="pug">
  v-container(v-if="timerSet")
    editor(
      :data="timerSet"
      :fields="require('../editors/TimerSet.json').fields"
      :loading="loading"
      @update="onUpdate"
    )
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Unsubscribe } from 'firebase';
import store, { TimerSetReference, TimerSetSnapshot } from '../store';
import { exists } from '../firebase';
import TimerSet from '../types/TimerSet';
import Editor from '../components/editor/Editor.vue';

@Component({
  components: { Editor },
})
export default class TimerSetEditor extends Vue {
  get timerSetId(): string {
    return this.$route.params.timerSetId;
  }

  get timerSetRef(): TimerSetReference {
    return store.collection('timer-sets').doc(this.timerSetId);
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
