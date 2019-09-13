<template lang="pug">
  v-app#app
    app-bar
    v-content
      timer-list
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppBar from './components/AppBar.vue';
import TimerList from './components/TimerList.vue';

@Component({
  components: {
    AppBar,
    TimerList,
  },
})
export default class App extends Vue {}
</script>
