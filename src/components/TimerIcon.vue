<template lang="pug">
  v-avatar.mr-2(:size="28" v-if="timer.icon")
    img(alt="" :src="timer.icon")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Timer from '../types/Timer';

@Component({
  components: {},
})
export default class TimerIcon extends Vue {
  @Prop({ required: true, type: Object }) timer!: Timer;
}
</script>
