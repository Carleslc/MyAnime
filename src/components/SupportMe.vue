<template>
  <q-btn
    type="a"
    href="https://ko-fi.com/carleslc"
    target="_blank"
    color="purple"
    label="<3"
    icon="img:statics/kofi.png"
  >
    <q-tooltip transition-show="fade" transition-hide="fade" content-class="bg-primary shadow-2" class="no-scroll">
      <div v-html="donate" />
    </q-tooltip>
  </q-btn>
</template>

<script>
import { nl2br } from '@/utils/strings';

export default {
  computed: {
    donate() {
      return nl2br(this.$t('donate'));
    },
  },
};
</script>

<style>
.q-icon > img {
  width: 2rem;
  height: 2rem;
}
</style>
