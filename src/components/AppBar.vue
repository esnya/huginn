<template lang="pug">
  v-app-bar(
    app
    dark
    fixed
    color="primary"
  )
    v-app-bar-nav-icon
      img.huginn-nav-icon(:src="require('../assets/icon.png')")
    v-toolbar-title HUGINN
    v-spacer
    v-btn(icon @click="signOut")
      v-icon mdi-logout
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { auth } from '../firebase';

@Component({
  components: {},
})
export default class AppBar extends Vue {
  async signOut(): Promise<void> {
    await auth.signOut();
  }
}
</script>

<style lang="stylus" scoped>
.huginn-nav-icon
  max-height 48px
  max-width 48px
</style>
