<template lang="pug">
  .huginn-home
    app-bar
    v-content
      v-container
        v-card
          v-card-title タイマーセット
          v-data-table(
            :headers="headers"
            :items="items"
          )
            template(v-slot:item.actions="{ item }")
              td
                v-row
                  v-spacer
                  v-col(cols="auto")
                    v-btn(color="primary" :to="{ name: 'timer-set-home', params: { id: item.snapshot.ref.id } }")
                      v-icon(left) mdi-login
                      | 開く
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import store from '../store';
import { QueryDocumentSnapshot } from '../firebase';
import TimerSet from '../types/TimerSet';
import AppBar from '../components/AppBar.vue';
import TableHeader from '../types/TableHeader';

@Component({
  components: {
    AppBar,
  },
})
export default class Home extends Vue {
  @Prop({ required: true, type: Object }) user!: firebase.User;

  get items(): (TimerSet & { snapshot: QueryDocumentSnapshot<TimerSet> })[] {
    return this.snapshots.map(snapshot => ({ ...snapshot.data(), snapshot }));
  }

  readonly headers: TableHeader[] = [
    { text: '名前', value: 'name' },
    { text: '', value: 'actions' },
  ];
  snapshots = new Array<QueryDocumentSnapshot<TimerSet>>();

  async created(): Promise<void> {
    const unsubscribe = store
      .collection('timer-sets')
      .where('owner', '==', this.user.uid)
      .onSnapshot(snapshot =>
        snapshot.docChanges().forEach(change => {
          const { doc } = change;

          switch (change.type) {
            case 'added':
              this.snapshots.splice(change.newIndex, 0, doc);
              break;
            case 'modified':
              this.snapshots.splice(change.oldIndex, 1);
              this.snapshots.splice(change.newIndex, 0, doc);
              break;
            case 'removed':
              this.snapshots.splice(change.oldIndex, 1);
              break;
          }
        }),
      );
    this.$once('destroyed', unsubscribe);
  }
}
</script>
