<template lang="pug">
  v-avatar.mr-2(:size="28" v-if="src")
    img(:src="src")
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class TimerIcon extends Vue {
  @Prop({ required: true, type: String }) name!: string;

  src: string | null = null;

  @Watch('name')
  async updateIcon(name: string): Promise<void> {
    const { default: src } = await import(`../assets/${name}.png`);
    this.src = src;
  }

  async created(): Promise<void> {
    await this.updateIcon(this.name);
  }
}
</script>
