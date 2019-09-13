<template lang="pug">
  tr.lighten-5(:class="[color, `${color}--text`]")
    td
      v-avatar.mr-2(:size="28" v-if="icon")
        img(:src="icon")
      span {{value.name}}
    td {{value.level}}
    td {{timestampText}}
    td {{value.area}}
    td {{value.field}}
    td
      v-btn-toggle(:value="null")
        v-btn(small @click="fromNow(120)") 120分後
        v-btn(small @click="charryOver(121)") 繰越121分
        v-btn(small @click="inputDialog = true") 入力
    v-dialog(:max-width="300" v-model="inputDialog")
      template(v-slot:activator="{ on }")
      v-card
        v-card-title {{value.name}}
        v-card-text
          v-text-field(hide-details name="input" type="number" v-model="inputValue" @keypress.enter="set")
            template(v-slot:append) 分後
        v-card-actions
          v-spacer
          v-btn(color="primary" @click="set") セット
          v-btn(@click="inputDialog = false") キャンセル
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import Timer from '../timers/Timer';

const ColorTable: [number, string][] = [
  [-1, 'grey'],
  [0, 'red'],
  [1, 'orange'],
  [3, 'amber'],
];

const AlertTable: Record<string, string> = {
  red: 'https://actions.google.com/sounds/v1/cartoon/cowbell_ringing.ogg',
  orange: 'https://actions.google.com/sounds/v1/cartoon/strike_hollow_wood.ogg',
  amber: 'https://actions.google.com/sounds/v1/cartoon/instrument_strum.ogg',
};

function play(src: string): void {
  const audio = document.createElement('audio');
  audio.src = src;
  audio.play();
  audio.addEventListener('ended', () => audio.remove());
}

@Component({
  components: {},
})
export default class TimerRow extends Vue {
  @Prop({ required: true, type: Object })
  value!: Timer & { ref: firebase.firestore.DocumentReference };

  public icon: string | null = null;
  public inputDialog = false;
  public inputValue: number | string = 120;
  public now: number = Date.now();

  public get dur(): number {
    return this.value.timestamp - this.now;
  }

  public get color(): string {
    const dur = this.dur;

    const matched = ColorTable.find(([t]) => dur < t * 60 * 1000);
    if (!matched) return 'green';
    return matched[1];
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

  public async set(): Promise<void> {
    this.inputDialog = false;
    await this.fromNow(Number(this.inputValue));
  }

  @Watch('value')
  public async updateIcon(value: Timer): Promise<void> {
    const { default: icon } = await import(`../assets/${value.name}.png`);
    this.icon = icon;
  }

  @Watch('color')
  public playAlert(color: string, prevColor: string): void {
    if (color === prevColor) return;

    const src = AlertTable[color];
    if (!src) return;
    play(src);
  }

  private unsubscribers: (() => void)[] = [];
  private async created(): Promise<void> {
    const interval = setInterval(() => {
      this.now = Date.now();
    }, 500);
    this.unsubscribers.push(() => clearInterval(interval));
    await this.updateIcon(this.value);
  }
  private destroyed(): void {
    this.unsubscribers.forEach(f => f());
  }
}
</script>
