<template lang="pug">
  v-tooltip(left)
    template(v-slot:activator="{ on }")
      v-btn(
        color="primary"
        fab
        fixed bottom right
        :loading="loading"
        v-on="on"
        @click="onClick"
      )
        v-icon mdi-file-export
    span エクスポート
</template>

<script lang="ts">
import save from 'save-file';
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class ExportFab extends Vue {
  @Prop({ required: true, type: Object })
  timersRef!: firebase.firestore.CollectionReference;

  loading: boolean = false;

  async onClick(): Promise<void> {
    try {
      this.loading = true;
      const snapshot = await this.timersRef.orderBy('level').get();
      const timers = snapshot.docs.map(doc => doc.data());
      const json = JSON.stringify(
        {
          timers,
        },
        null,
        2,
      );
      save(new Blob([json]), 'timer.json');
    } finally {
      this.loading = false;
    }
  }
}
</script>
