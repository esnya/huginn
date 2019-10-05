<template lang="pug">
  .huginn-editor
    v-row(
      :key="i"
      cols="auto"
      v-for="(field, i) in fields"
    )
      v-col(cols="12")
        editor-field(
          :data="data"
          :field="field"
          :loading="loading"
          @update="$emit('update', field.value, $event)"
        )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EditorField from './EditorField.vue';
import Field from './Field';

@Component({
  components: {
    EditorField,
  },
})
export default class Editor extends Vue {
  @Prop({ required: true, type: Object }) data!: {};
  @Prop({ required: true, type: Array }) fields!: Field[];
  @Prop({ required: false, type: Boolean, default: false }) loading!: boolean;
}
</script>
