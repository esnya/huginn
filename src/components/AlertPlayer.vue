<template lang="pug">
  div
    audio(
      preload
      :key="sound.color"
      :ref="sound.color"
      :src="sound.src"
      v-for="sound in sounds"
    )
</template>

<script lang="ts">
import get from 'lodash/get';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import TableHeader from '../types/TableHeader';
import Timer from '../types/Timer';
import getColor from '../color';

const sounds = [
  {
    color: 'red',
    src: 'https://actions.google.com/sounds/v1/cartoon/cowbell_ringing.ogg',
  },
  {
    color: 'orange',
    src: 'https://actions.google.com/sounds/v1/cartoon/strike_hollow_wood.ogg',
  },
  {
    color: 'amber',
    src: 'https://actions.google.com/sounds/v1/cartoon/instrument_strum.ogg',
  },
];
const soundColors = sounds.map(sound => sound.color);

@Component({
  components: {},
})
export default class AlertPlayer extends Vue {
  @Prop({ required: true, type: Number }) dur!: number;
  @Prop({ required: true, type: Object }) timer!: Timer;
  @Prop({ required: true, type: Array }) attributes!: TableHeader[];

  readonly sounds = sounds;

  play(color: string): void {
    const { timer, dur } = this;

    soundColors.forEach(key => {
      const targetOrArray = this.$refs[key];
      const target = Array.isArray(targetOrArray)
        ? targetOrArray[0]
        : targetOrArray;
      if (!(target instanceof HTMLAudioElement)) return;

      if (key === color) {
        // console.log('play', color);
        if ('Notification' in window) {
          const minutes = Math.ceil(dur / 60000);
          const timeText = minutes === 0 ? '出現' : `${minutes}分前`;
          const body = this.attributes
            .map(({ text, value }) => `${text}: ${get(timer, value)}`)
            .join('\n');
          new Notification(`${timeText} ${timer.name}`, {
            icon: timer.icon,
            body,
          });
        }
        target.play();
      } else {
        target.pause();
        target.currentTime = 0;
      }
    });
  }

  @Watch('dur', { immediate: true })
  watchDur(dur: number, prevDur: number): void {
    if (dur >= prevDur) return;

    const color = getColor(this.dur);
    const prevColor = getColor(prevDur);
    if (color === prevColor) return;

    this.play(color);
  }
}
</script>
