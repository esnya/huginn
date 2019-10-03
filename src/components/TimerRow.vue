<template lang="pug">
  tr.lighten-5(:class="[color, `${color}--text`]")
    td
      timer-icon.mr-3(:name="value.name")
      span {{value.name}}
    td {{timestampText}}
    td(
      :key="i"
      v-for="(attribute, i) in attributeValues"
    ) {{attribute}}
    td
      timer-actions(:timerRef="value.ref" @edit="inputDialog = true")
    input-dialog(:name="value.name" :timerRef="value.ref" v-model="inputDialog")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import get from 'lodash/get';
import Timer from '../types/Timer';
import TableHeader from '../types/TableHeader';
import getColor from '../color';
import { TimerReference } from '../store';
import AlertPlayer from './AlertPlayer.vue';
import InputDialog from './InputDialog.vue';
import TimerActions from './TimerActions.vue';
import TimerIcon from './TimerIcon.vue';

@Component({
  components: {
    AlertPlayer,
    InputDialog,
    TimerActions,
    TimerIcon,
  },
})
export default class TimerRow extends Vue {
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
    const abs = Math.abs(this.dur);
    const seconds = Math.floor(abs / 1000);
    const minutes = Math.floor(seconds / 60);
    return [minutes, seconds % 60].map(n => `${n}`.padStart(2, '0')).join(':');
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
