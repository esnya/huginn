<template lang="pug">
  div
    table-field(
      :data="data"
      :field="field"
      :loading="loading"
      v-if="field.type === 'table'"
      @update="$emit('update', $event)"
    )
    text-field(
      :data="data"
      :field="field"
      :loading="loading"
      v-else
      @update="$emit('update', $event)"
    )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Field from './Field';
import TableField from './TableField.vue';
import TextField from './TextField.vue';

@Component({
  components: {
    TableField,
    TextField,
  },
})
export default class EditorField extends Vue {
  @Prop({ required: true, type: Object }) data!: {};
  @Prop({ required: true, type: Object }) field!: Field;
  @Prop({ required: false, type: Boolean, default: false }) loading!: boolean;
}
</script>
