<template lang="pug">
  v-dialog(:max-width="300" :value="value" @input="emitInput")
    v-card
      v-card-title {{name}}
      v-card-text
        v-text-field(hide-details name="input" type="number" v-model="inputValue" @keypress.enter="set")
          template(v-slot:append) 分後
      v-card-actions
        v-spacer
        v-btn(color="primary" @click="set") セット
        v-btn(@click="emitInput(false)") キャンセル
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { TimerReference } from '../store';

@Component({
  components: {},
})
export default class InputDialog extends Vue {
  @Prop({ required: true, type: String }) name!: string;
  @Prop({ required: true, type: Boolean }) value!: boolean;
  @Prop({ required: true, type: Object }) timerRef!: TimerReference;

  @Emit('input')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  emitInput(value: boolean) {}

  inputValue: number | string = 120;

  async set(): Promise<void> {
    const minutes = Number(this.inputValue);
    await this.timerRef.update({
      timestamp: Date.now() + minutes * 60 * 1000,
    });
    this.emitInput(false);
  }
}
</script>
