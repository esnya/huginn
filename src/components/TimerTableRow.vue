<template lang="pug">
  tr.huginn-timer-row.lighten-5(:class="[color, `${color}--text`]")
    td
      timer-name(:timer="value")
    td {{timestampText}}
    td.d-none.d-sm-table-cell(
      :key="i"
      v-for="(attribute, i) in attributeValues"
    ) {{attribute}}
    td
      timer-actions.flex-nowrap(:timerRef="value.ref" :timestamp="value.timestamp" :interval="value.interval" @edit="$emit('edit')")
    alert-player(:dur="dur" :timer="value" :attributes="attributes")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import get from 'lodash/get';
import Timer from '../types/Timer';
import TableHeader from '../types/TableHeader';
import getColor from '../color';
import { TimerReference } from '../store';
import AlertPlayer from './AlertPlayer.vue';
import TimerActions from './TimerActions.vue';
import TimerName from './TimerName.vue';

@Component({
  components: {
    AlertPlayer,
    TimerActions,
    TimerName,
  },
})
export default class TimerTableRow extends Vue {
  @Prop({ required: true, type: Object })
  value!: Timer & { ref: TimerReference };

  @Prop({ required: true, type: Array }) attributes!: TableHeader[];

  inputDialog = false;
  now: number = Date.now();

  get dur(): number {
    return this.value.timestamp - this.now;
  }

  get color(): string {
    return getColor(this.dur);
  }

  get carryOveredTimestampText(): string | null {
    const interval = Number(this.value.interval) || 120 * 60 * 1000;
    let dur = this.dur;

    if (dur > -interval) return null;

    while (dur <= 0) {
      dur += interval + 60 * 1000;
    }

    const seconds = Math.floor(dur / 1000);
    const minutes = Math.floor(seconds / 60);

    return [minutes, seconds % 60].map(n => `${n}`.padStart(2, '0')).join(':');
  }

  get timestampText(): string {
    const abs = Math.abs(this.dur);
    const seconds = Math.floor(abs / 1000);
    const minutes = Math.floor(seconds / 60);
    const text = [minutes, seconds % 60]
      .map(n => `${n}`.padStart(2, '0'))
      .join(':');
    const cText = this.carryOveredTimestampText;
    return cText ? `${text} (${cText})` : text;
  }

  get attributeValues(): (string | number | boolean)[] {
    return this.attributes.map(({ value }) =>
      value ? get(this.value, value) : '',
    );
  }

  unsubscribers: (() => void)[] = [];
  async created(): Promise<void> {
    const interval = setInterval(() => {
      this.now = Date.now();
    }, 500);
    this.$once('destroyed', () => clearInterval(interval));
  }
}
</script>
