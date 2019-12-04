<template lang="pug">
  tr.huginn-timer-row.lighten-5(:class="[color, `${color}--text`]")
    td
      timer-name(:timer="value")
    td {{durationText}}
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
import moment, { duration } from 'moment';
import formatter from 'format-number';
import Timer from '../types/Timer';
import TableHeader from '../types/TableHeader';
import getColor from '../color';
import { TimerReference } from '../store';
import AlertPlayer from './AlertPlayer.vue';
import TimerActions from './TimerActions.vue';
import TimerName from './TimerName.vue';

const padLeft = formatter({
  padLeft: 2,
});
function formatDuration(value: number): string {
  const dur = duration(value);
  const seconds = Math.floor(dur.seconds());
  const minutes = Math.floor(dur.asMinutes());

  return `${padLeft(minutes)}:${padLeft(seconds)}`;
}

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

  get timestampText(): string {
    return moment(this.value.timestamp).format('HH:mm:ss');
  }

  get charryOveredDuration(): number | null {
    const interval = Number(this.value.interval) || 120 * 60 * 1000;
    let dur = this.dur;

    if (dur >= 0) return null;

    while (dur <= 0) {
      dur += interval + 60 * 1000;
    }

    return dur;
  }

  get durationText(): string {
    const durationText = formatDuration(Math.abs(this.dur));

    const { charryOveredDuration } = this;
    if (!charryOveredDuration) return durationText;

    return `${durationText} (${formatDuration(charryOveredDuration)})`;
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
