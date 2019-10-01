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
        timer-row(:value="item")
    export-fab(:timersRef="timersRef")
</template>

<script lang="ts">
import { firestore } from 'firebase';
import { Component, Vue, Prop } from 'vue-property-decorator';
import DefaultTimers from '../timers/DefaultTimers';
import Timer from '../timers/Timer';
import ExportFab from './ExportFab.vue';
import TimerRow from './TimerRow.vue';

@Component({
  components: {
    ExportFab,
    TimerRow,
  },
})
export default class TimerList extends Vue {
  @Prop({ required: true, type: Object })
  timersRef!: firebase.firestore.CollectionReference;

  readonly headers = [
    { text: '名前', value: 'name' },
    { text: 'レベル', value: 'level' },
    { text: '残り時間', value: 'timestamp' },
    { text: 'エリア', value: 'area' },
    { text: 'フィールド', value: 'field' },
    { text: '', value: 'actions', sortable: false },
  ];

  timers: (Timer & { ref: firebase.firestore.DocumentReference })[] = [];

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
