<template>
  <item-button dense icon="delete" label="Reset settings" caption="Clean user data and filters" @click="reset" />
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
