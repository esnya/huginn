<template lang="pug">
  .huginn-timer-set
    timer-table(:timers-ref="timersRef" @edit="editingTimer = $event")
    timer-editor(v-model="editingTimer")
    v-btn(
      color="primary"
      fab
      fixed bottom right
      :to="{ name: 'timer-set-edit', params: { id: snapshot.ref.id } }"
    )
      v-icon mdi-pencil
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { TimerSetSnapshot, TimerCollectionReference } from '../../store';
import TimerEditor from '../../components/TimerEditor.vue';
import TimerTable from '../../components/TimerTable.vue';
import { QueryDocumentSnapshot } from '../../firebase';
import Timer from '../../types/Timer';

@Component({
  components: {
    TimerTable,
    TimerEditor,
  },
})
export default class TimerSetHome extends Vue {
  @Prop({ required: true, type: Object }) user!: firebase.User;
  @Prop({ required: true, type: Object }) snapshot!: TimerSetSnapshot;

  editingTimer: QueryDocumentSnapshot<Timer> | null = null;

  get timersRef(): TimerCollectionReference {
    return this.snapshot.ref.collection('timers');
  }
}
</script>
