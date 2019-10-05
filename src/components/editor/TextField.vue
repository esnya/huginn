<template lang="pug">
  v-text-field(
    :label="field.text"
    :loading="loading"
    :required="field.required"
    :rules="field.required ? [value => value ? true : '必須項目'] : []"
    :type="field.type"
    :value="value"
    v-if="field.type === 'text'"
    @change="$emit('update', $event)"
  )
</template>

<script lang="ts">
import get from 'lodash/get';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { TextField as TextFieldType } from './Field';

@Component({
  components: {},
})
export default class TextField extends Vue {
  @Prop({ required: true, type: Object }) data!: {};
  @Prop({ required: true, type: Object }) field!: TextFieldType;
  @Prop({ required: false, type: Boolean, default: false }) loading!: boolean;

  get value(): string | null {
    return get(this.data, this.field.value);
  }
}
</script>
