<template lang="pug">
  v-card
    v-card-title
      | {{field.text}}
      v-spacer
      v-btn(color="primary" @click="addDialog = {}")
        v-icon(left) mdi-plus
        | 追加
      v-dialog(
        :value="addDialog"
        @input="addDialog = $event ? addDialog : null"
      )
        v-card
          v-card-title
            v-icon(left) mdi-plus
            | {{field.text}}を追加
          v-card-text
            editor-field(
              :key="i"
              :data="addDialog || {}"
              :field="subField"
              v-for="(subField, i) in field.fields"
              @update="addDialog = set(addDialog, subField.value, $event)"
            )
          v-card-actions
            v-spacer
            v-btn(color="primary" @click="add")
              v-icon(left) mdi-plus
              | 追加
            v-spacer
            v-btn(@click="addDialog = null")
              v-icon(left) mdi-cancel
              | キャンセル
            v-spacer
    v-data-table(
      :headers="headers"
      :items="items"
    )
      template(v-slot:item="{ item, index }")
        table-field-row(
          :data="data"
          :field="field"
          :item="item"
          :index="index"
          :loading="loading"
          @update="$emit('update', $event)"
        )
</template>

<script lang="ts">
import get from 'lodash/get';
import set from 'lodash/set';
import { Component, Vue, Prop } from 'vue-property-decorator';
import TableHeader from '../../types/TableHeader';
import { TableField as TableFieldType } from './Field';
import TableFieldRow from './TableFieldRow.vue';

@Component({
  components: {
    EditorField: () => import('./EditorField.vue'),
    TableFieldRow,
  },
})
export default class TableField extends Vue {
  @Prop({ required: true, type: Object }) data!: {};
  @Prop({ required: true, type: Object }) field!: TableFieldType;
  @Prop({ required: false, type: Boolean, default: false }) loading!: boolean;

  addDialog: any = null;

  get headers(): TableHeader[] {
    return [
      ...this.field.fields,
      { text: '', value: 'actions', align: 'center' as 'center' },
    ].map(h => ({
      ...h,
      sortable: false,
    }));
  }

  get items(): {}[] {
    return get(this.data, this.field.value) || [];
  }

  set<T extends {}, U>(target: T, path: string, value: U): T {
    return set(target, path, value);
  }

  add(): void {
    if (!this.addDialog) return;

    this.$emit('update', [
      ...(get(this.data, this.field.value) || []),
      this.addDialog,
    ]);
    this.addDialog = null;
  }
}
</script>
