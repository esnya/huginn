<template lang="pug">
  v-app#app
    main
      timer-list
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TimerList from './components/TimerList.vue';

@Component({
  components: {
    TimerList,
  },
})
export default class App extends Vue {}
</script>
