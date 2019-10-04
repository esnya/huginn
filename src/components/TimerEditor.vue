<template lang="pug">
  v-dialog(max-width="12em" :value="Boolean(value)" @input="emitInput($event ? value : null)")
    v-card
      v-card-title
        timer-name(:timer="value.data()" v-if="value")
      v-card-text
        v-text-field.huginn-timer-editor-input(
          name="from-now"
          ref="input"
          suffix="分後"
          v-model="fromNow"
          @keypress.enter="submit"
        )
      v-card-actions
        v-spacer
        v-btn(color="primary" :disabled="!fromNow" @click="submit") OK
        v-btn(@click="emitInput(null)") キャンセル
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import Timer from '../types/Timer';
import { QueryDocumentSnapshot, exists } from '../firebase';
import TimerName from './TimerName.vue';

@Component({
  components: {
    TimerName,
  },
})
export default class TimerEditor extends Vue {
  @Prop({ required: false, type: Object })
  value?: QueryDocumentSnapshot<Timer> | null;

  fromNow: string = '120';

  @Emit('input')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  emitInput(value: QueryDocumentSnapshot<Timer> | null): void {}

  @Watch('value', { immediate: true })
  updateFromNow(
    next: QueryDocumentSnapshot<Timer> | null,
    prev: QueryDocumentSnapshot<Timer> | null,
  ): void {
    if (!prev && next && exists(next)) {
      const { timestamp } = next.data();
      const now = Date.now();
      if (timestamp > now) {
        this.fromNow = `${Math.floor((timestamp - now) / 60000)}`;
      } else {
        this.fromNow = '120';
      }

      this.$nextTick(() => {
        const input = (this.$refs.input as Vue).$el.querySelector('input');
        if (!input) return;

        this.$nextTick(() => {
          input.focus();
          input.selectionStart = 0;
          input.selectionEnd = -1;
        });
      });
    }
  }

  async submit(): Promise<void> {
    if (!this.value) return;

    const fromNow = Number(this.fromNow);
    if (Number.isNaN(fromNow) || fromNow <= 0) return;

    await this.value.ref.update({
      timestamp: Date.now() + fromNow * 60000,
    });

    this.emitInput(null);
  }
}
</script>

<style lang="stylus" scoped>
.huginn-timer-editor-input :global(input)
  text-align right
</style>
