<template lang="pug">
  v-app-bar(
    app
    dark
    fixed
    color="primary"
  )
    v-app-bar-nav-icon(:to="{ name: 'home' }")
      img.huginn-nav-icon(:src="require('../assets/icon.png')")
    v-toolbar-title {{title}}
    v-spacer
    v-btn(icon @click="signOut")
      v-icon mdi-logout
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { auth } from '../firebase';

@Component({
  components: {},
})
export default class AppBar extends Vue {
  @Prop({ required: false, type: String, default: 'Huginn' }) title!: string;

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
