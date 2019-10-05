<template lang="pug">
  tr
    td(
      :key="j"
      v-for="(subField, j) in field.fields"
    )
      editor-field(
        :data="item"
        :field="subField"
        :loading="loading"
      )
    td
      v-row
        v-spacer
        v-col(cols="auto")
          v-btn(:disabled="index === 0" icon @click="up")
            v-icon mdi-arrow-up
        v-col(cols="auto")
          v-btn(:disabled="isLast" icon @click="down")
            v-icon mdi-arrow-down
        v-col(cols="auto")
          v-dialog(v-model="delDialog")
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
                  :headers="delHeaders"
                  hide-default-footer
                  :items="[item]"
                )
              v-card-actions
                v-spacer
                v-btn(color="error" @click="del")
                  v-icon(left) mdi-delete
                  | 削除
                v-spacer
                v-btn(@click="delDialog = false")
                  v-icon(left) mdi-cancel
                  | キャンセル
                v-spacer
        v-spacer
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { TableField } from './Field';
import TableHeader from '../../types/TableHeader';
import get from 'lodash/get';

@Component({
  components: {
    EditorField: () => import('./EditorField.vue'),
  },
})
export default class TableFieldRow extends Vue {
  @Prop({ required: true, type: Object }) data!: {};
  @Prop({ required: true, type: Object }) field!: TableField;
  @Prop({ required: true, type: Object }) item!: {};
  @Prop({ required: true, type: Number }) index!: number;
  @Prop({ required: false, type: Boolean, default: true }) loading!: boolean;

  get delHeaders(): TableHeader[] {
    return this.field.fields.map(h => ({ ...h, sortable: false }));
  }

  get isLast(): boolean {
    return this.index === get(this.data, this.field.value).length - 1;
  }

  delDialog = false;

  del(): void {
    const prev = get(this.data, this.field.value) || [];

    this.$emit('update', [
      ...prev.slice(0, this.index),
      ...prev.slice(this.index + 1),
    ]);

    this.delDialog = false;
  }

  up(): void {
    const prev = get(this.data, this.field.value) || [];

    this.$emit('update', [
      ...prev.slice(0, this.index - 1),
      prev[this.index],
      prev[this.index - 1],
      ...prev.slice(this.index + 1),
    ]);
  }

  down(): void {
    const prev = get(this.data, this.field.value) || [];

    this.$emit('update', [
      ...prev.slice(0, this.index),
      prev[this.index + 1],
      prev[this.index],
      ...prev.slice(this.index + 2),
    ]);
  }
}
</script>
