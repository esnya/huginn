<template lang="pug">
  v-container(v-if="timerSet")
    v-card
      v-card-text
        div(
          :key="i"
          v-for="(field, i) in fields"
        )
          v-card(v-if="field.type === 'table'")
            v-card-title
              | {{field.text}}
              v-spacer
              v-btn(color="primary" @click="dialogs = {...dialogs, [`${i}.add`]: {}}")
                v-icon(left) mdi-plus
                | 追加
              v-dialog(
                :value="dialogs[`${i}.add`]"
                @input="dialogs = { ...dialogs, [`${i}.add`]: $event ? dialogs[`${i}.add`] : null }"
              )
                v-card
                  v-card-title
                    v-icon(left) mdi-plus
                    | {{field.text}}を追加
                  v-card-text
                    v-text-field(
                      :key="j"
                      :label="subField.text"
                      :value="get(dialogs[`${i}.add`], subField.value)"
                      v-for="(subField, j) in field.fields"
                      @input="set(dialogs[`${i}.add`], subField.value, $event)"
                    )
                  v-card-actions
                    v-spacer
                    v-btn(color="primary" @click="addSub(field.value, dialogs[`${i}.add`]); dialogs = { ...dialogs, [`${i}.add`]: null }")
                      v-icon(left) mdi-plus
                      | 追加
                    v-spacer
                    v-btn(@click="dialogs = { ...dialogs, [`${i}.add`]: null }")
                      v-icon(left) mdi-cancel
                      | キャンセル
                    v-spacer
            v-data-table(
              :headers="[...field.fields, { value: 'actions', align: 'center' }].map(h => ({...h, sortable: false}))"
              :items="get(timerSet, field.value)"
            )
              template(v-slot:item="{ item, index }")
                tr
                  td(
                    :key="j"
                    v-for="(subField, j) in field.fields"
                  )
                    v-text-field(
                      :label="subField.text"
                      :value="get(item, subField.value)"
                      @input="updateSub(field.value, index, subField.value, $event)"
                    )
                  td
                    v-row
                      v-spacer
                      v-col(cols="auto")
                        v-dialog(:value="Boolean(dialogs[`${i}.${index}.delete`])" @input="dialogs[`${i}.${index}.delete`] = $event")
                          template(v-slot:activator="{ on }")
                            v-btn(color="error" v-on="on")
                              v-icon(left) mdi-delete
                              | 削除
                          v-card
                            v-card-title
                              v-icon(color="error" left) mdi-alert
                              | 削除しますか？
                            v-card-text
                              v-data-table(
                                :headers="field.fields.map(h => ({...h, sortable: false}))"
                                hide-default-footer
                                :items="[item]"
                              )
                            v-card-actions
                              v-spacer
                              v-btn(color="error" @click="deleteSub(field.value, index); dialogs[`${i}.${index}.delete`] = false")
                                v-icon(left) mdi-delete
                                | 削除
                              v-spacer
                              v-btn(@click="dialogs[`${i}.${index}.delete`] = false")
                                v-icon(left) mdi-cancel
                                | キャンセル
                              v-spacer
                      v-spacer
          v-text-field(
            :label="field.text"
            :required="field.required"
            :rules="field.required ? [value => value ? true : '必須項目'] : []"
            :value="get(timerSet, field.value)"
            @input="update(field.value, $event === '' ? null : $event)"
            v-else
          )
</template>

<script lang="ts">
import get from 'lodash/get';
import set from 'lodash/set';
import { Component, Vue, Watch } from 'vue-property-decorator';
import store, { TimerSetReference, TimerSetSnapshot } from '../store';
import { exists } from '../firebase';
import TimerSet from '../types/TimerSet';
import { Unsubscribe } from 'firebase';

@Component({
  components: {},
})
export default class TimerSetEditor extends Vue {
  readonly fields = [
    { text: '名前', value: 'name', required: true },
    {
      text: '属性',
      value: 'attributes',
      type: 'table',
      fields: [
        { text: '名前', value: 'text', required: true },
        { text: '属性名', value: 'value', required: true },
      ],
    },
    { text: 'パスワード', value: 'password' },
  ];

  dialogs: Record<string, any> = {};

  get timerSetId(): string {
    return this.$route.params.timerSetId;
  }

  get timerSetRef(): TimerSetReference {
    return store.collection('timer-sets').doc(this.timerSetId);
  }

  timerSetSnapshot: TimerSetSnapshot | null = null;
  unsubscribe: Unsubscribe | null = null;
  @Watch('timerSetRef', { immediate: true })
  async updateSnapshot(): Promise<void> {
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    this.unsubscribe = this.timerSetRef.onSnapshot(
      snapshot => (this.timerSetSnapshot = snapshot),
    );
    this.timerSetSnapshot = await this.timerSetRef.get();
  }

  get timerSet(): TimerSet | null {
    const snapshot = this.timerSetSnapshot;
    return snapshot && exists(snapshot) ? snapshot.data() : null;
  }

  get<T, U>(value: T, field: string): U {
    return get(value, field);
  }
  set<T extends {}, U>(target: T, field: string, value: U): T {
    return set(target, field, value);
  }

  async update<T>(field: string, value: T): Promise<void> {
    await this.timerSetRef.update(field, value);
  }

  async addSub<T>(field: string, value: T): Promise<void> {
    const prev: [] = this.get(this.timerSet, field);
    const next = [...prev, value];
    await this.update(field, next);
  }

  async updateSub<T>(
    field: string,
    index: number,
    subField: string,
    value: T,
  ): Promise<void> {
    const prev: [] = this.get(this.timerSet, field) || [];
    const next = prev.map((item, i) =>
      i === index ? set(item, subField, value) : item,
    );
    await this.update(field, next);
  }

  async deleteSub<T>(field: string, index: number): Promise<void> {
    const prev: [] = this.get(this.timerSet, field);
    const next = [...prev.slice(0, index), ...prev.slice(index + 1)];
    await this.update(field, next);
  }

  getDialog<T>(id: string): T | false {
    const dialog = get(this.dialogs, id) as T | undefined;
    return dialog ? dialog : false;
  }
  setDialog<T>(id: string, value: T) {
    this.dialogs = set(this.dialogs, id, value);
  }
}
</script>
