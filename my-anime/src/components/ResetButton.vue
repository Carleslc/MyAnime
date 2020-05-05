<template>
  <item-button dense icon="delete" label="Reset settings" caption="Clean user data and filters" @click="reset" />
</template>

<script>
import { LocalStorage } from 'quasar';

export default {
  methods: {
    reset() {
      LocalStorage.clear();
    },
  },
};
</script>
