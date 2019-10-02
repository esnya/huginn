<template lang="pug">
  .huginn-timer-list
    v-data-table(
      sort-by="timestamp"
      :headers="headers"
      :items="timers"
      :items-per-page="100"
      :loading="timers.length === 0"
    )
      template(v-slot:item="{ item }")
        timer-row(:value="item" :attributes="attributes")
    io-fab(:timersRef="timersRef")
</template>

<script lang="ts">
import { firestore } from 'firebase';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import DefaultTimers from '../timers/DefaultTimers';
import Timer from '../timers/Timer';
import IoFab from './IoFab.vue';
import TimerRow from './TimerRow.vue';
import TableHeader from '../types/TableHeader';
import TimerSet from '../types/TimerSet';

@Component({
  components: {
    IoFab,
    TimerRow,
  },
})
export default class TimerList extends Vue {
  @Prop({ required: true, type: Object })
  timersRef!: firebase.firestore.CollectionReference;

  get headers(): TableHeader[] {
    return [
      { text: '名前', value: 'name' },
      { text: '残り時間', value: 'timestamp' },
      ...this.attributes,
      { text: '', value: 'actions', sortable: false },
    ];
  }

  timers: (Timer & { ref: firebase.firestore.DocumentReference })[] = [];

  attributes: TableHeader[] = [];

  @Watch('timersRef', { immediate: true })
  async updateAttributes(): Promise<void> {
    this.attributes = [];

    const timerRef = this.timersRef.parent;
    if (!timerRef) return;

    const data = (await timerRef.get()).data() as TimerSet | undefined;
    if (!data) return;

    this.attributes = data.attributes;
  }

  async created(): Promise<void> {
    const unsubscribe = this.timersRef.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        const name = change.doc.id;
        const ref = change.doc.ref;
        const data = change.doc.data() as Timer;
        switch (change.type) {
          case 'added':
            this.timers.push({ ...data, ref });
            break;
          case 'modified': {
            const timer = this.timers.find(a => a.name === name);
            if (!timer) this.timers.push({ ...data, ref });
            else Object.assign(timer, data);
            break;
          }
          case 'removed':
            this.timers = this.timers.filter(a => a.name !== name);
            break;
        }
      });
    });
    this.$once('destroyed', unsubscribe);

    await Promise.all(
      DefaultTimers.map(async timer => {
        const timerRef = this.timersRef.doc(timer.name);
        const snapshot = await timerRef.get();

        if (snapshot.exists) {
          await timerRef.update(timer);
        } else {
          await timerRef.set({
            ...timer,
            timestamp: Date.now(),
          });
        }
      }),
    );
  }
}
</script>
