<template lang="pug">
  div {{text}}
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import getColor from '../color';

@Component({
  components: {},
})
export default class Timestamp extends Vue {
  @Prop({ required: true, type: Number }) timestamp!: number;

  now: number = Date.now();

  get dur(): number {
    return this.timestamp - this.now;
  }

  get text(): string {
    const abs = Math.abs(this.dur);
    const seconds = Math.floor(abs / 1000);
    const minutes = Math.floor(seconds / 60);
    return [minutes, seconds % 60].map(n => `${n}`.padStart(2, '0')).join(':');
  }

  get color(): string {
    return getColor(this.dur);
  }

  @Watch('color', { immediate: true })
  onColorChange(color: string, prevColor: string): void {
    this.emitColorChange(color, prevColor);
  }

  @Emit('color')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  emitColorChange(color: string, prevColor: string): void {}

  async created(): Promise<void> {
    const interval = setInterval(() => {
      this.now = Date.now();
    }, 500);
    this.$once('destroyed', () => clearInterval(interval));
  }
}
</script>
