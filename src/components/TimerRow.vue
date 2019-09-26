<template lang="pug">
  tr.lighten-5(:class="[color, `${color}--text`]")
    td
      timer-icon.mr-3(:name="value.name")
      span {{value.name}}
    td {{value.level}}
    td {{timestampText}}
    td {{value.area}}
    td {{value.field}}
    td
      v-row
        v-col
          v-btn(small @click="fromNow(120)") 120分後
        v-col
          v-btn(small @click="charryOver(121)") 繰越121分
        v-col
          v-btn(small @click="inputDialog = true") 入力
      alert-player(:dur="dur")
    input-dialog(:name="value.name" :timerRef="value.ref" v-model="inputDialog")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import AlertPlayer from './AlertPlayer.vue';
import InputDialog from './InputDialog.vue';
import TimerIcon from './TimerIcon.vue';
import Timer from '../timers/Timer';
import getColor from '../color';

@Component({
  components: {
    AlertPlayer,
    InputDialog,
    TimerIcon,
  },
})
export default class TimerRow extends Vue {
  @Prop({ required: true, type: Object })
  value!: Timer & { ref: firebase.firestore.DocumentReference };

  public inputDialog = false;
  public now: number = Date.now();

  public get dur(): number {
    return this.value.timestamp - this.now;
  }

  public get color(): string {
    return getColor(this.dur);
  }

  private get timestampText(): string {
    const abs = Math.abs(this.dur);
    const seconds = Math.floor(abs / 1000);
    const minutes = Math.floor(seconds / 60);
    return [minutes, seconds % 60].map(n => `${n}`.padStart(2, '0')).join(':');
  }

  public async fromNow(minutes: number): Promise<void> {
    await this.value.ref.update({
      timestamp: Date.now() + minutes * 60 * 1000,
    });
  }

  public async charryOver(minutes: number): Promise<void> {
    const now = Date.now();
    let { timestamp } = this.value;
    while (timestamp < now) {
      timestamp += minutes * 60 * 1000;
    }

    await this.value.ref.update({
      timestamp,
    });
  }

  private unsubscribers: (() => void)[] = [];
  private async created(): Promise<void> {
    const interval = setInterval(() => {
      this.now = Date.now();
    }, 500);
    this.unsubscribers.push(() => clearInterval(interval));
  }
  private destroyed(): void {
    this.unsubscribers.forEach(f => f());
  }
}
</script>
