<template lang="pug">
  v-app#app
    with-user
      template(v-slot="{ user }")
        router-view(:user="user")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import WithUser from './components/WithUser.vue';

@Component({
  components: {
    WithUser,
  },
})
export default class App extends Vue {}
</script>
