<template lang="pug">
  div
    timer-icon.mr-3(:name="timer.name")
    span {{timer.name}}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Timer from '../types/Timer';
import TimerIcon from './TimerIcon.vue';

@Component({
  components: {
    TimerIcon,
  },
})
export default class TimerName extends Vue {
  @Prop({ required: true, type: Object }) timer!: Timer;
}
</script>
