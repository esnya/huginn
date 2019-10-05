<template lang="pug">
  .huginn-timer-set
    timer-table(:timers-ref="timersRef" @edit="editingTimer = $event")
    timer-editor(v-model="editingTimer")
    v-btn(
      color="primary"
      fab
      fixed bottom right
      :to="{ name: 'timer-set-editor', params: { timerSetId } }"
    )
      v-icon mdi-pencil
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import TimerSetType from '../types/TimerSet';
import store, { TimerSetReference, TimerCollectionReference } from '../store';
import TimerEditor from '../components/TimerEditor.vue';
import TimerTable from '../components/TimerTable.vue';

@Component({
  components: {
    TimerTable,
    TimerEditor,
  },
})
export default class TimerSet extends Vue {
  @Prop({ required: true, type: Object }) user!: firebase.User;

  get timerSetId(): string {
    return this.$route.params.timerSetId;
  }

  get timerSetRef(): TimerSetReference {
    return store.collection('timer-sets').doc(this.timerSetId);
  }

  get timersRef(): TimerCollectionReference {
    return this.timerSetRef.collection('timers');
  }

  editingTimer: QueryDocumentSnapshot<Timer> | null = null;
  timerSet: TimerSetType | null = null;

  @Watch('timerSetRef', { immediate: true })
  async watchTimerSet(): Promise<void> {
    try {
      await new Promise((resolve, reject) => {
        const unsubscribe = this.timerSetRef.onSnapshot(
          snapshot => {
            this.timerSet = (snapshot.data() || null) as TimerSetType | null;
          },
          reject,
          resolve,
        );
        this.$once('destroyed', unsubscribe);
      });
    } catch (error) {
      if (error.code === 'permission-denied') {
        this.$router.push({
          name: 'timer-set-auth',
          params: { timerSetId: this.timerSetId },
        });
      } else {
        throw error;
      }
    }
  }

  @Watch('timerSet')
  updateTitle(): void {
    document.title = this.timerSet
      ? `${this.timerSet.name} - Huginn`
      : 'Huginn';
  }
}
</script>
