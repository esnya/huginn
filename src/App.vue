<template lang="pug">
  v-app#app
    app-bar
    v-content
      with-user
        template(v-slot="{ user }")
          router-view(:user="user")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppBar from './components/AppBar.vue';
import WithUser from './components/WithUser.vue';
import { firestore } from './firebase';

@Component({
  components: {
    AppBar,
    WithUser,
  },
})
export default class App extends Vue {
  public getTimersRef(
    user: firebase.User,
  ): firebase.firestore.CollectionReference {
    return firestore
      .collection('users')
      .doc(user.uid)
      .collection('timer-sets')
      .doc('default')
      .collection('timers');
  }
}
</script>
