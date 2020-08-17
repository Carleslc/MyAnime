<template>
  <item-button
    dense
    icon="delete"
    :label="$t('resetSettings')"
    :caption="$t('resetSettingsDescription')"
    @click="reset"
  />
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  methods: {
    ...mapMutations('store', ['clear']),
    reset() {
      this.$q.localStorage.clear();
      this.clear();
    },
  },
};
</script>
