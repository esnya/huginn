<template lang="pug">
  span(:class="classNames") {{text}}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class FromNow extends Vue {
  @Prop({ type: Number, required: true }) value!: number;

  private get text(): string {
    const dur = this.value - this.now;
    const abs = Math.abs(dur);
    const seconds = Math.floor(abs / 1000);
    const minutes = Math.floor(seconds / 60);
    return [minutes, seconds % 60].map(n => `${n}`.padStart(2, '0')).join(':');
  }

  private get classNames(): Record<string, boolean> {
    const dur = this.value - this.now;
    if (dur < 0) return { 'red--text': true };
    else if (dur <= 60 * 1000) return { 'orange--text': true };
    else if (dur <= 3 * 60 * 1000) return { 'amber--text': true };
    return { 'green--text': true };
  }

  private now: number = Date.now();
  private interval?: ReturnType<typeof setInterval>;
  private created(): void {
    this.interval = setInterval(() => {
      this.now = Date.now();
    }, 500);
  }
  private destroyed(): void {
    if (this.interval) clearInterval(this.interval);
  }
}
</script>
