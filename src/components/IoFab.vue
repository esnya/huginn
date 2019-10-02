<template lang="pug">
  v-speed-dial(
    fixed bottom right
    v-model="fab"
  )
    template(v-slot:activator)
      v-btn(v-model="fab" color="primary" fab)
        v-icon(v-if="fab") mdi-close
        v-icon(v-else) mdi-file
    export-fab(:timersRef="timersRef")
    import-fab(:timersRef="timersRef")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import ExportFab from './ExportFab.vue';
import ImportFab from './ImportFab.vue';

@Component({
  components: {
    ExportFab,
    ImportFab,
  },
})
export default class IoFab extends Vue {
  @Prop({ required: true, type: Object })
  timersRef!: firebase.firestore.CollectionReference;

  fab: boolean = false;
}
</script>
