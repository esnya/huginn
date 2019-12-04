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
        timer-table-row.text-truncate(:value="item" :attributes="attributes" @edit="$emit('edit', item.snapshot)")
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import TableHeader from '../types/TableHeader';
import Timer from '../types/Timer';
import TimerSet from '../types/TimerSet';
import {
  TimerReference,
  TimerCollectionReference,
  QueryDocumentSnapshot,
} from '../store';
import TimerTableRow from './TimerTableRow.vue';

@Component({
  components: {
    TimerTableRow,
  },
})
export default class TimerTable extends Vue {
  @Prop({ required: true, type: Object })
  timersRef!: TimerCollectionReference;

  get headers(): TableHeader[] {
    return [
      { text: '名前', value: 'name' },
      { text: '残り時間', value: 'timestamp' },
      { text: '出現時刻', value: 'timestamp' },
      ...this.attributes,
      { text: '', value: 'actions', sortable: false },
    ];
  }

  timers: (Timer & {
    ref: TimerReference;
    snapshot: QueryDocumentSnapshot<Timer>;
  })[] = [];

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
            this.timers.push({ ...data, ref, snapshot: change.doc });
            break;
          case 'modified': {
            const timer = this.timers.find(a => a.name === name);
            if (!timer)
              this.timers.push({ ...data, ref, snapshot: change.doc });
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
  }
}
</script>
