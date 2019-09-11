<template lang="pug">
  v-data-table(sort-by="timestamp" :headers="headers" :items="timers" :items-per-page="100")
    template(v-slot:item.timestamp="{ item }")
      from-now(:value="item.timestamp")
    template(v-slot:item.actions="{ item }")
      v-btn.mr-2(@click="fromNow(item.id, 120 * 60 * 1000)") 120分後
      v-btn.mr-2(@click="charryOver(item.id, 120 * 60 * 1000)") 繰越120分
      v-dialog(v-model="inputDialog[item.id]")
        template(v-slot:activator="{ on }")
          v-btn(v-on="on") 入力
        v-card
          v-card-text
            v-layout(align-end)
              v-text-field(hide-details type="number" v-model="inputValue")
              v-btn.ml-2(color="primary" @click="inputSet(item.id)") セット
              v-btn.ml-2(@click="inputDialog[item.id] = false") キャンセル
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Timers from '../timers/Timers';
import FromNow from './FromNow.vue';

function saveTimer(id: string, timestamp: number): void {
  localStorage.setItem(`huginn:timers:${id}`, JSON.stringify(timestamp));
}

@Component({
  components: {
    FromNow,
  },
})
export default class TimerList extends Vue {
  private readonly headers = [
    { text: '名前', value: 'name' },
    { text: 'レベル', value: 'level' },
    { text: '残り時間', value: 'timestamp' },
    { text: 'エリア', value: 'area' },
    { text: 'フィールド', value: 'field' },
    { text: '', value: 'actions', sortable: false },
  ];

  private timers = Timers;

  private fromNow(id: string, add: number): void {
    const timer = this.timers.find(t => t.id === id);
    if (!timer) return;

    timer.timestamp = Date.now() + add;

    saveTimer(id, timer.timestamp);
  }

  private charryOver(id: string, step: number): void {
    const timer = this.timers.find(t => t.id === id);
    if (!timer) return;

    const now = Date.now();
    while (timer.timestamp < now) {
      timer.timestamp += step;
    }

    saveTimer(id, timer.timestamp);
  }

  private inputDialog: { [id: string]: boolean | undefined } = {};
  private inputValue = 120;
  private inputSet(id: string): void {
    this.inputDialog[id] = false;
    this.fromNow(id, Number(this.inputValue) * 60 * 1000);
  }

  private created(): void {
    this.timers.forEach(timer => {
      const data = localStorage.getItem(`huginn:timers:${timer.id}`);
      if (!data) return;

      timer.timestamp = JSON.parse(data);
    });
  }
}
</script>
