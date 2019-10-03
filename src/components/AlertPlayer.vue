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
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
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

  readonly sounds = sounds;

  play(color: string): void {
    soundColors.forEach(key => {
      const targetOrArray = this.$refs[key];
      const target = Array.isArray(targetOrArray)
        ? targetOrArray[0]
        : targetOrArray;
      if (!(target instanceof HTMLAudioElement)) return;

      if (key === color) {
        // console.log('play', color);
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
