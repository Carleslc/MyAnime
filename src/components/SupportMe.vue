<template>
  <q-btn
    type="a"
    href="https://ko-fi.com/carleslc"
    target="_blank"
    color="purple"
    label="<3"
    icon="img:https://uploads-ssl.webflow.com/5c14e387dab576fe667689cf/5cbee341ae2b8813ae072f5b_Ko-fi_logo_RGB_Outline.png"
  >
    <q-tooltip transition-show="fade" transition-hide="fade" content-class="bg-primary">
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
