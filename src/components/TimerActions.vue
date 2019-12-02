<template lang="pug">
  div
    .d-none.d-sm-block
      v-row
        v-col(
          cols="auto"
          :key="i"
          v-for="(action, i) in actions"
        )
          v-btn(small @click="action.action") {{action.label}}
    v-menu(bottom left)
      template(v-slot:activator="{ on }")
        v-btn.d-sm-none(icon v-on="on")
          v-icon mdi-dots-vertical
      v-list
        v-list-item(
          :key="i"
          v-for="(action, i) in actions"
          @click="action.action"
        )
          v-list-item-title {{action.label}}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { TimerReference } from '../store';

@Component({
  components: {},
})
export default class TimerActions extends Vue {
  @Prop({ required: true, type: Object })
  timerRef!: TimerReference;
  @Prop({ required: false, type: Number }) timestamp?: number;
  @Prop({ required: false, type: Number, default: 120 * 60 * 1000 })
  interval!: number;

  get intervalInMinutes(): number {
    return Math.ceil(this.interval / (60 * 1000));
  }

  get actions() {
    return [
      {
        label: `${this.intervalInMinutes}分後`,
        action: () => this.fromNow(this.intervalInMinutes),
      },
      {
        label: `繰越${this.intervalInMinutes + 1}分`,
        action: () => this.charryOver(this.intervalInMinutes + 1),
      },
      { label: '入力', action: () => this.$emit('edit') },
      { label: '戻す', action: () => this.undo() },
    ];
  }

  async undo(): Promise<void> {
    const ss = await this.timerRef.get();
    const prevTimestamp = ss.get('prevTimestamp');
    if (typeof prevTimestamp == 'number') {
      await this.timerRef.update({
        prevTimestamp: this.timestamp,
        timestamp: prevTimestamp,
      });
    }
  }

  async fromNow(minutes: number): Promise<void> {
    const timestamp = Date.now() + minutes * 60 * 1000;
    await this.timerRef.update({
      prevTimestamp: this.timestamp || timestamp,
      timestamp,
    });
  }

  async charryOver(minutes: number): Promise<void> {
    const now = Date.now();
    let timestamp = Number(this.timestamp || now);

    while (timestamp <= now) {
      timestamp += minutes * 60 * 1000;
    }

    await this.timerRef.update({
      prevTimestamp: this.timestamp || timestamp,
      timestamp,
    });
  }
}
</script>
