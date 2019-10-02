<template lang="pug">
  v-container.huginn-not-found
    v-row(justify="center")
      img(alt="NotFound" :src="image")
    v-row(justify="center")
      p なにもないぽりん
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Image from '../assets/エンジェリング.png';

@Component({
  components: {},
})
export default class NotFound extends Vue {
  readonly image = Image;
}
</script>
