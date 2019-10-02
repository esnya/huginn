<template lang="pug">
  .huginn-timer-set
    timer-list(:timers-ref="timersRef")
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import TimerSetType from '../types/TimerSet';
import TimerList from '../components/TimerList.vue';
import { firestore } from '../firebase';

@Component({
  components: {
    TimerList,
  },
})
export default class TimerSet extends Vue {
  @Prop({ required: true, type: Object }) user!: firebase.User;

  get timerSetId(): string {
    return this.$route.params.timerSetId;
  }

  get timerSetRef(): firebase.firestore.DocumentReference {
    return firestore.collection('timer-sets').doc(this.timerSetId);
  }

  get timersRef(): firebase.firestore.CollectionReference {
    return this.timerSetRef.collection('timers');
  }

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
