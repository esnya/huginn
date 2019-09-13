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

@Component({
  components: {},
})
export default class AlertPlayer extends Vue {
  @Prop({ required: true, type: String }) color!: string;

  public readonly sounds = [
    {
      color: 'red',
      src: 'https://actions.google.com/sounds/v1/cartoon/cowbell_ringing.ogg',
    },
    {
      color: 'orange',
      src:
        'https://actions.google.com/sounds/v1/cartoon/strike_hollow_wood.ogg',
    },
    {
      color: 'amber',
      src: 'https://actions.google.com/sounds/v1/cartoon/instrument_strum.ogg',
    },
  ];

  @Watch('color')
  public play(color: string): void {
    const targetOrArray = this.$refs[color];
    const target = Array.isArray(targetOrArray)
      ? targetOrArray[0]
      : targetOrArray;
    if (!(target instanceof HTMLAudioElement)) return;

    target.play();
  }

  public created(): void {
    this.play(this.color);
  }
}
</script>
